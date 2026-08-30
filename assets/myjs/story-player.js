/* ============================================================================
   Reusable Instagram-style story / highlight player.

   One player drives one viewer (backdrop + stage + bars + media + controls).
   Call open(items, index) with the media list to show. The same instance can
   be reopened with a different list, so a page with many rings needs only one.

   StoryPlayer.mount({
     backdrop, stage, bars, media,   // required elements
     mute, close, prev, next,        // optional controls
     seenKey,                        // optional localStorage key -- omit it and
                                     //   nothing is ever marked seen, which is
                                     //   what makes highlights permanent
     onOpen(items, index),           // optional hooks
     onClose(),
     returnFocusTo                   // element, or a function returning one,
                                     //   to refocus when the viewer closes
   })  ->  { open: fn(items, index), close: fn() }

   Media items: { src, type?: 'image' | 'video', alt?, duration? }
   ========================================================================== */

(function () {
  'use strict';

  var DEFAULT_DURATION = 5000;
  var HOLD_MS = 200;
  // A video that stalls or never decodes does not always fire an 'error'
  // event -- it can sit in networkState LOADING forever. Without this the
  // story would hang on a frozen progress bar, so give up and move on.
  // "Stalled" means no clock movement AND no new bytes: a big file arriving
  // slowly is progress, not a stall, so it must not be skipped.
  var STALL_MS = 8000;
  // An element that is paused rather than starved is usually a refused
  // autoplay (iOS Low Power Mode, a strict engine after unmuting). Re-ask it
  // to play instead of silently dropping the story on the first hiccup.
  var RETRY_PLAY_MS = 1000;

  function mount(opts) {
    var backdrop = opts.backdrop;
    var stage = opts.stage;
    var barsWrap = opts.bars;
    var mediaWrap = opts.media;
    var muteBtn = opts.mute;
    var closeBtn = opts.close;
    var prevBtn = opts.prev;
    var nextBtn = opts.next;
    if (!backdrop || !stage || !barsWrap || !mediaWrap) return null;

    // -- State ---------------------------------------------------------------
    var items = [];
    var index = 0;
    var rafId = null;
    var startTs = 0;
    var elapsed = 0;
    var duration = DEFAULT_DURATION;
    var paused = false;
    var video = null;
    var lastVideoTime = -1;
    var lastBufferedEnd = -1;
    var lastProgressTs = 0;
    var lastPlayRetryTs = 0;
    var fills = [];
    var holdTimer = null;
    var suppressClick = false;

    // -- Seen state ----------------------------------------------------------
    // We only remember the src of the last item viewed. When a new one is
    // appended the stored value no longer matches the tail, so the ring lights
    // up again on its own. Skipped entirely without a seenKey.
    function markSeen() {
      if (!opts.seenKey || !items.length) return;
      try { localStorage.setItem(opts.seenKey, items[items.length - 1].src); } catch (e) {}
    }

    // -- Helpers -------------------------------------------------------------
    function isVideo(item) {
      if (item.type) return item.type === 'video';
      return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(item.src);
    }

    function setFill(i, ratio) {
      if (fills[i]) fills[i].style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
    }

    function stopLoop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    // How far the download has got. Growing = the network is still feeding us,
    // so a video that has not started playing yet is loading, not stalled.
    function bufferedEnd(el) {
      try {
        var b = el.buffered;
        return b && b.length ? b.end(b.length - 1) : 0;
      } catch (e) { return 0; }
    }

    function tick(now) {
      rafId = requestAnimationFrame(tick);
      if (paused) return;

      var ratio;
      if (video) {
        // Videos keep their own clock, so read it directly.
        var vTime = video.currentTime;
        var vBuf = bufferedEnd(video);
        if (vTime !== lastVideoTime || vBuf !== lastBufferedEnd) {
          // Playing, or still downloading. Either way it is alive.
          lastVideoTime = vTime;
          lastBufferedEnd = vBuf;
          lastProgressTs = now;
        } else {
          // Neither the clock nor the buffer moved. If the element is merely
          // paused the browser refused to play it, so ask again before judging.
          if (video.paused && now - lastPlayRetryTs > RETRY_PLAY_MS) {
            lastPlayRetryTs = now;
            video.play().catch(function () {});
          }
          if (now - lastProgressTs > STALL_MS) {
            stopLoop(); next(); return;   // stalled, don't hang the viewer
          }
        }
        ratio = duration ? (vTime * 1000) / duration : 0;
      } else {
        elapsed = now - startTs;
        ratio = elapsed / duration;
      }

      setFill(index, ratio);
      if (ratio >= 1) { stopLoop(); next(); }
    }

    function startLoop() {
      stopLoop();
      elapsed = 0;
      paused = false;
      startTs = performance.now();
      lastVideoTime = -1;
      lastBufferedEnd = -1;
      lastProgressTs = startTs;
      lastPlayRetryTs = startTs;
      // We just cleared `paused`, so the dimmed chrome must go with it --
      // otherwise advancing mid-hold (keyboard, or the stall watchdog) leaves
      // the bars and header stuck at 0.25 opacity until the viewer closes.
      stage.classList.remove('is-paused');
      rafId = requestAnimationFrame(tick);
    }

    function pause() {
      if (paused) return;
      paused = true;
      if (video) { video.pause(); }
      else { elapsed = performance.now() - startTs; }
      stage.classList.add('is-paused');
    }

    function resume() {
      if (!paused) return;
      paused = false;
      // Time spent held/hidden must not count towards the stall watchdog.
      lastProgressTs = performance.now();
      lastPlayRetryTs = lastProgressTs;
      if (video) { video.play().catch(function () {}); }
      else { startTs = performance.now() - elapsed; }
      stage.classList.remove('is-paused');
    }

    // -- Rendering -----------------------------------------------------------
    function buildBars() {
      barsWrap.innerHTML = '';
      fills = [];
      items.forEach(function () {
        var bar = document.createElement('div');
        bar.className = 'story-bar';
        var fill = document.createElement('div');
        fill.className = 'story-bar-fill';
        bar.appendChild(fill);
        barsWrap.appendChild(bar);
        fills.push(fill);
      });
    }

    function preloadNext() {
      var upcoming = items[index + 1];
      if (upcoming && !isVideo(upcoming)) { new Image().src = upcoming.src; }
    }

    function syncMuteIcon() {
      if (!video || !muteBtn) return;
      var icon = muteBtn.querySelector('i');
      if (icon) {
        icon.className = video.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
      }
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    }

    function show(i) {
      stopLoop();
      index = i;
      // Stop the outgoing video explicitly; dropping it from the DOM alone does
      // not reliably halt playback or its audio.
      if (video) { video.pause(); video.removeAttribute('src'); }
      video = null;

      // Bars behind us are full, bars ahead are empty.
      fills.forEach(function (fill, n) {
        fill.style.transform = 'scaleX(' + (n < i ? 1 : 0) + ')';
      });

      var item = items[i];
      mediaWrap.innerHTML = '';

      if (isVideo(item)) {
        var vid = document.createElement('video');
        vid.src = item.src;
        vid.muted = true;          // muted so autoplay is allowed
        vid.playsInline = true;
        vid.setAttribute('playsinline', '');
        vid.preload = 'auto';
        if (item.alt) vid.setAttribute('aria-label', item.alt);

        // Each listener bails if this video is no longer the one on screen, so a
        // discarded element cannot advance the story it was replaced by.
        vid.addEventListener('loadedmetadata', function () {
          if (video !== vid) return;
          duration = isFinite(vid.duration) && vid.duration > 0
            ? vid.duration * 1000
            : DEFAULT_DURATION;
        });
        vid.addEventListener('ended', function () {
          if (video !== vid) return;
          stopLoop(); next();
        });
        vid.addEventListener('error', function () {
          if (video !== vid) return;
          stopLoop(); next();
        });

        mediaWrap.appendChild(vid);
        video = vid;
        duration = DEFAULT_DURATION; // provisional until metadata lands
        vid.play().catch(function () {});

        if (muteBtn) { muteBtn.hidden = false; syncMuteIcon(); }
      } else {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || '';
        mediaWrap.appendChild(img);
        duration = item.duration || DEFAULT_DURATION;
        if (muteBtn) muteBtn.hidden = true;
      }

      startLoop();
      preloadNext();
    }

    // -- Navigation ----------------------------------------------------------
    function next() {
      if (index >= items.length - 1) { close(); return; }
      show(index + 1);
    }

    function prev() {
      if (index <= 0) { show(0); return; }
      show(index - 1);
    }

    function open(list, i) {
      items = (list || []).filter(function (s) { return s && s.src; });
      if (!items.length) return;
      buildBars();
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (opts.onOpen) opts.onOpen(items, i || 0);
      show(i || 0);
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      stopLoop();
      paused = false;
      stage.classList.remove('is-paused');
      if (video) { video.pause(); }
      video = null;
      mediaWrap.innerHTML = '';   // also stops any audio
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      markSeen();
      if (opts.onClose) opts.onClose();
      var back = typeof opts.returnFocusTo === 'function'
        ? opts.returnFocusTo()
        : opts.returnFocusTo;
      if (back && back.focus) back.focus();
    }

    // -- Viewer wiring -------------------------------------------------------
    if (closeBtn) closeBtn.addEventListener('click', close);

    if (muteBtn) muteBtn.addEventListener('click', function () {
      if (!video) return;
      video.muted = !video.muted;
      syncMuteIcon();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () {
      if (suppressClick) { suppressClick = false; return; }
      prev();
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (suppressClick) { suppressClick = false; return; }
      next();
    });

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close();
    });

    // Press and hold to pause. A short press stays a tap so the nav zones work.
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.story-head')) return;
      suppressClick = false;
      holdTimer = setTimeout(function () {
        holdTimer = null;
        suppressClick = true;
        pause();
      }, HOLD_MS);
    });

    function endHold() {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (paused) resume();
    }

    stage.addEventListener('pointerup', endHold);
    stage.addEventListener('pointercancel', endHold);
    stage.addEventListener('pointerleave', endHold);

    document.addEventListener('keydown', function (e) {
      if (!backdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { prev(); }
      else if (e.key === 'ArrowRight') { next(); }
    });

    // Pause while the tab is hidden so nothing advances off-screen.
    document.addEventListener('visibilitychange', function () {
      if (!backdrop.classList.contains('is-open')) return;
      if (document.hidden) pause(); else resume();
    });

    return { open: open, close: close };
  }

  window.StoryPlayer = { mount: mount };
})();
