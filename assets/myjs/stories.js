/* ============================================================================
   Instagram-style stories on the hero profile picture.

   Reads the global STORIES array from stories-data.js and hands it to the
   shared player in story-player.js. With no stories the ring stays exactly as
   it was and nothing here is wired up.
   ========================================================================== */

(function () {
  'use strict';

  var SEEN_KEY = 'alifStoriesSeen';

  var stories = (window.STORIES || []).filter(function (s) { return s && s.src; });
  var ring = document.getElementById('storyRing');
  if (!ring || !stories.length || !window.StoryPlayer) return;

  var player = window.StoryPlayer.mount({
    backdrop: document.getElementById('storyBackdrop'),
    stage: document.getElementById('storyStage'),
    bars: document.getElementById('storyBars'),
    media: document.getElementById('storyMedia'),
    mute: document.getElementById('storyMute'),
    close: document.getElementById('storyClose'),
    prev: document.getElementById('storyPrev'),
    next: document.getElementById('storyNext'),
    seenKey: SEEN_KEY,
    onClose: function () { ring.classList.add('is-seen'); },
    returnFocusTo: ring
  });
  if (!player) return;

  // -- Ring setup ------------------------------------------------------------
  function readSeen() {
    try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; }
  }

  ring.classList.add('has-story');
  if (readSeen() === stories[stories.length - 1].src) ring.classList.add('is-seen');
  ring.setAttribute('role', 'button');
  ring.setAttribute('tabindex', '0');
  ring.setAttribute('aria-label', 'View stories');

  ring.addEventListener('click', function () { player.open(stories, 0); });
  ring.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); player.open(stories, 0); }
  });
})();
