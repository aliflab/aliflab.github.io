/* ============================================================================
   Book highlights on the Reading page.

   Each book in reading-data.js can carry a `highlights` array of photos. The
   card's cover then shows a gradient ring; clicking it opens the shared story
   player (story-player.js) with just that book's photos.

   Highlights are permanent: no seenKey is passed to the player, so nothing is
   ever marked as viewed and the ring never dulls. The date lives on the card,
   not on the slides -- see reading.js.

   Loaded before reading.js, which calls ReadingHighlights.open(book).
   ========================================================================== */

(function () {
  'use strict';

  if (!window.StoryPlayer) return;

  var avatar = document.getElementById('rhAvatar');
  var titleEl = document.getElementById('rhTitle');
  var lastTrigger = null;

  var player = window.StoryPlayer.mount({
    backdrop: document.getElementById('rhBackdrop'),
    stage: document.getElementById('rhStage'),
    bars: document.getElementById('rhBars'),
    media: document.getElementById('rhMedia'),
    mute: document.getElementById('rhMute'),
    close: document.getElementById('rhClose'),
    prev: document.getElementById('rhPrev'),
    next: document.getElementById('rhNext'),
    // No seenKey on purpose -- highlights never expire and never grey out.
    returnFocusTo: function () { return lastTrigger; }
  });
  if (!player) return;

  window.ReadingHighlights = {
    // book: an entry from READING_BOOKS. trigger: the element to refocus on close.
    open: function (book, trigger) {
      if (!book || !book.highlights || !book.highlights.length) return;
      lastTrigger = trigger || null;

      // The viewer header shows the book instead of a profile: its cover and
      // its title. The cover may not exist yet, so hide the thumbnail rather
      // than showing a broken image.
      if (avatar) {
        if (book.coverImage) {
          avatar.src = book.coverImage;
          avatar.alt = '';
          avatar.hidden = false;
        } else {
          avatar.removeAttribute('src');
          avatar.hidden = true;
        }
      }
      if (titleEl) titleEl.textContent = book.title || '';

      player.open(book.highlights, 0);
    }
  };
})();
