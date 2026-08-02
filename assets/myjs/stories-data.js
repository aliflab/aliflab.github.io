/* ============================================================================
   Story data for the hero profile picture (Instagram-style stories).

   HOW TO ADD A STORY
   1. Drop the file into  assets/images/stories/
      Name it  YYYY-MM-DD-slug.jpg  (or .png / .mp4)
      Images look best at 1080x1920 (9:16). Keep videos short (< 30s).
   2. Add an entry at the END of the array below (stories play in order).
   3. Commit and push. That's it.

   To take a story down, delete its entry.
   Adding a new entry automatically re-lights the ring for everyone.

   Fields
     src       required  path to the media, relative to the site root
     type      optional  'image' | 'video'  (inferred from the extension)
     alt       optional  description for screen readers
     duration  optional  images only, milliseconds (default 5000)
                         videos use their own length
   ========================================================================== */

var STORIES = [
  // {
  //   src: 'assets/images/stories/2026-08-01-sunrise.jpg',
  //   type: 'image',
  //   alt: 'Sunrise over Wollongong harbour',
  //   duration: 5000
  // },
  // {
  //   src: 'assets/images/stories/2026-08-02-lab.mp4',
  //   type: 'video',
  //   alt: 'Quick lab tour'
  // }
];
