/* ============================================================
   READING DATA — this is the ONLY file you edit to manage the
   Reading page. No build step: just edit and refresh.
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   BOOKS
   Add one object per book. Fields:
     title         (required)  — book title
     author        (required)  — author name(s)
     slug          (required)  — kebab-case id. It is also the name of the
                                 book's highlight folder under
                                 assets/images/reading/highlights/
     coverImage    (required)  — path to a cover image, e.g.
                                 "../assets/images/reading/atomic-habits.jpg"
                                 (drop your cover files in that folder)
     ratings       (required)  — your scores out of 5. Include only the
                                 categories you have; missing rows are hidden:
                                 { content, information, writing, story, overall }
     highlightDate (optional)  — "YYYY-MM-DD". Shown as a small pill on the
                                 cover. Change it whenever you like — nothing
                                 expires and nothing is computed from it.
     highlights    (optional)  — the photos behind the cover's gradient ring
                                 (see below). Empty or missing = no ring, the
                                 cover just sits there like a normal card.
     notes         (optional)  — a short line of your thoughts.

   ─── ADDING A HIGHLIGHT (3 steps) ───
   1. Drop the photo into  assets/images/reading/highlights/<slug>/
      Name them 01.jpg, 02.jpg, … in the order you want them shown.
      Best at 1080x1920 (9:16). Short .mp4 clips work too.
   2. Add a line to that book's `highlights` array below.
   3. Set `highlightDate` to the date you want on the cover.

   IMPORTANT: paths here are relative to reading/index.html — the page that
   loads this file — so they start with "../", exactly like coverImage.

   Highlight item fields:
     src       required  path to the photo/clip
     alt       optional  description for screen readers
     duration  optional  images only, milliseconds (default 5000)
     type      optional  'image' | 'video' (otherwise read from the extension)

   Highlights never expire. Remove a line to take a photo down.
   ───────────────────────────────────────────────────────────── */
const READING_BOOKS = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    slug: "atomic-habits",
    coverImage: "../assets/images/reading/atomic-habits.jpg",
    ratings: { content: 4, information: 5, writing: 4, overall: 4.5 },
    highlightDate: "",
    highlights: [
      // { src: "../assets/images/reading/highlights/atomic-habits/01.jpg", alt: "Chapter 2 notes" },
      // { src: "../assets/images/reading/highlights/atomic-habits/02.jpg" }
    ],
    notes: "Practical, actionable framework for building tiny habits that compound."
  },
  {
    title: "Blue Ocean Strategy",
    author: "W. Chan Kim & Renée Mauborgne",
    slug: "blue-ocean-strategy",
    coverImage: "../assets/images/reading/blue-ocean-strategy.jpg",
    ratings: { content: 5, information: 4, writing: 3 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "Crushing It!",
    author: "Gary Vaynerchuk",
    slug: "crushing-it",
    coverImage: "../assets/images/reading/crushing-it.jpg",
    ratings: { content: 4, information: 5, writing: 3.5 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "Eat That Frog!",
    author: "Brian Tracy",
    slug: "eat-that-frog",
    coverImage: "../assets/images/reading/eat-that-frog.jpg",
    ratings: { content: 5, information: 5, writing: 5 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "Google Guys",
    author: "Richard L. Brandt",
    slug: "google-guys",
    coverImage: "../assets/images/reading/google-guys.jpg",
    ratings: { content: 3, information: 4, writing: 4, overall: 3.5 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    slug: "how-to-win-friends-and-influence-people",
    coverImage: "../assets/images/reading/how-to-win-friends-and-influence-people.jpg",
    ratings: { content: 4.5, information: 4.5, writing: 5, overall: 4.9 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    slug: "the-alchemist",
    coverImage: "../assets/images/reading/the-alchemist.jpg",
    ratings: { content: 5, information: 5, writing: 5, story: 4.5 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    slug: "the-design-of-everyday-things",
    coverImage: "../assets/images/reading/the-design-of-everyday-things.jpg",
    ratings: { content: 5, information: 5, writing: 5, overall: 5 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    slug: "the-subtle-art",
    coverImage: "../assets/images/reading/the-subtle-art.jpg",
    ratings: { content: 5, information: 5, writing: 4, overall: 4.6 },
    highlightDate: "",
    highlights: [
      {src: "../assets/images/reading/highlights/the-subtle-art/01.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/02.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/03.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/04.mp4"},
      {src: "../assets/images/reading/highlights/the-subtle-art/05.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/06.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/07.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/08.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/09.jpg"},
      {src: "../assets/images/reading/highlights/the-subtle-art/10.jpg"}
    ]
  },
  {
    title: "The Theory of Everything",
    author: "Stephen Hawking",
    slug: "the-theory-of-everything",
    coverImage: "../assets/images/reading/the-theory-of-everything.jpg",
    ratings: { content: 3, information: 4, writing: 3 },
    highlightDate: "",
    highlights: []
  },
  {
    title: "Who Moved My Cheese?",
    author: "Spencer Johnson",
    slug: "who-moved-my-cheese",
    coverImage: "../assets/images/reading/who-moved-my-cheese.jpg",
    ratings: { content: 5, information: 4, writing: 5 },
    highlightDate: "",
    highlights: []
  }
];
