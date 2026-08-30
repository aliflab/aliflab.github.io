=============================================================
 READING PAGE IMAGES
=============================================================

BOOK COVERS
-----------
Drop your book cover images straight in this folder.

Reference them from assets/myjs/reading-data.js using paths like:
    coverImage: "../assets/images/reading/atomic-habits.jpg"

Recommended: portrait covers (e.g. 400x600). If a cover file is
missing, the card automatically shows a "No cover" placeholder.


HIGHLIGHT PHOTOS  ->  highlights/
---------------------------------
One folder per book, already created, named after that book's
`slug` in reading-data.js:

    highlights/atomic-habits/
    highlights/blue-ocean-strategy/
    highlights/crushing-it/
    highlights/eat-that-frog/
    highlights/google-guys/
    highlights/how-to-win-friends-and-influence-people/
    highlights/the-alchemist/
    highlights/the-design-of-everyday-things/
    highlights/the-subtle-art/
    highlights/the-theory-of-everything/
    highlights/who-moved-my-cheese/

(The .gitkeep file in each one only exists so git keeps the empty
folder. Leave it alone; delete nothing.)

Adding a photo - 3 steps:

  1. Drop it in that book's folder. Name them 01.jpg, 02.jpg,
     03.jpg ... numbered in the order you want them shown.
     .png and short .mp4 clips work too.

  2. Register it in that book's `highlights` array in
     assets/myjs/reading-data.js - a photo does nothing until
     you do:

         highlights: [
           { src: "../assets/images/reading/highlights/atomic-habits/01.jpg" }
         ]

  3. Set `highlightDate` on the same book to the date you want
     shown on the cover, e.g. highlightDate: "2026-03-14".

Once a book has at least one registered photo, its cover gets the
Instagram-style gradient ring and opens the highlight viewer.

Sizing
  1080x1920 (9:16 portrait) fits the viewer edge to edge.
  Anything else is letterboxed rather than cropped.
  Videos: keep them short (< 30s) and web-optimised (H.264 mp4).
  They start muted so autoplay is not blocked; viewers can unmute.

Highlights never expire and the ring never dulls. Remove a line
from the array to take a photo down.
