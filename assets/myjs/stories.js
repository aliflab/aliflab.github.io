/* ============================================================================
   Instagram-style stories on the hero profile picture.

   Reads the global STORIES array from stories-data.js. With no stories the
   ring stays exactly as it was and nothing here is wired up.
   ========================================================================== */

(function () {
  'use strict';

  var stories = (window.STORIES || []).filter(function (s) { return s && s.src; });
  var ring = document.getElementById('storyRing');
  if (!ring || !stories.length) return;

  var backdrop = document.getElementById('storyBackdrop');
  var stage = document.getElementById('storyStage');
  var barsWrap = document.getElementById('storyBars');
  var mediaWrap = document.getElementById('storyMedia');
  var muteBtn = document.getElementById('storyMute');
  var closeBtn = document.getElementById('storyClose');
  var prevBtn = document.getElementById('storyPrev');
  var nextBtn = document.getElementById('storyNext');
  if (!backdrop || !stage || !barsWrap || !mediaWrap) return;

  var SEEN_KEY = 'alifStoriesSeen';
  var DEFAULT_DURATION = 5000;
  var HOLD_MS = 200;
  // A video that stalls or never decodes does not always fire an 'error'
  // event -- it can sit in networkState LOADING forever. Without this the
  // story would hang on a frozen progress bar, so give up and move on.
  var STALL_MS = 8000;

  // ── State ──────────────────────────────────────────────────────────────────
  var index = 0;
  var rafId = null;
  var startTs = 0;
  var elapsed = 0;
  var duration = DEFAULT_DURATION;
  var paused = false;
  var video = null;
  var lastVideoTime = -1;
  var lastProgressTs = 0;
  var fills = [];
  var holdTimer = null;
  var suppressClick = false;

  // ── Seen state ─────────────────────────────────────────────────────────────
  // We only remember the src of the last story viewed. When a new story is
  // appended the stored value no longer matches the tail, so the ring lights
  // up again on its own.
  function readSeen() {
    try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; }
  }

  function markSeen() {
    try { localStorage.setItem(SEEN_KEY, stories[stories.length - 1].src); } catch (e) {}
    ring.classList.add('is-seen');
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function isVideo(story) {
    if (story.type) return story.type === 'video';
    return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(story.src);
  }

  function setFill(i, ratio) {
    if (fills[i]) fills[i].style.transform = 'scaleX(' + Math.max(0, Math.min(1, ratio)) + ')';
  }

  function stopLoop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    if (paused) return;

    var ratio;
    if (video) {
      // Videos keep their own clock, so read it directly.
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        lastProgressTs = now;
      } else if (now - lastProgressTs > STALL_MS) {
        stopLoop(); next(); return;   // stalled, don't hang the viewer
      }
      ratio = duration ? (video.currentTime * 1000) / duration : 0;
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
    lastProgressTs = startTs;
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
    if (video) { video.play().catch(function () {}); }
    else { startTs = performance.now() - elapsed; }
    stage.classList.remove('is-paused');
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  function buildBars() {
    barsWrap.innerHTML = '';
    fills = [];
    stories.forEach(function () {
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
    var upcoming = stories[index + 1];
    if (upcoming && !isVideo(upcoming)) { new Image().src = upcoming.src; }
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

    var story = stories[i];
    mediaWrap.innerHTML = '';

    if (isVideo(story)) {
      var vid = document.createElement('video');
      vid.src = story.src;
      vid.muted = true;          // muted so autoplay is allowed
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.preload = 'auto';
      if (story.alt) vid.setAttribute('aria-label', story.alt);

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

      muteBtn.hidden = false;
      syncMuteIcon();
    } else {
      var img = document.createElement('img');
      img.src = story.src;
      img.alt = story.alt || '';
      mediaWrap.appendChild(img);
      duration = story.duration || DEFAULT_DURATION;
      muteBtn.hidden = true;
    }

    startLoop();
    preloadNext();
  }

  function syncMuteIcon() {
    if (!video) return;
    var icon = muteBtn.querySelector('i');
    if (icon) {
      icon.className = video.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function next() {
    if (index >= stories.length - 1) { close(); return; }
    show(index + 1);
  }

  function prev() {
    if (index <= 0) { show(0); return; }
    show(index - 1);
  }

  function open(i) {
    buildBars();
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
    ring.focus();
  }

  // ── Ring setup ─────────────────────────────────────────────────────────────
  ring.classList.add('has-story');
  if (readSeen() === stories[stories.length - 1].src) ring.classList.add('is-seen');
  ring.setAttribute('role', 'button');
  ring.setAttribute('tabindex', '0');
  ring.setAttribute('aria-label', 'View stories');

  ring.addEventListener('click', function () { open(0); });
  ring.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(0); }
  });

  // ── Viewer wiring ──────────────────────────────────────────────────────────
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
})();
