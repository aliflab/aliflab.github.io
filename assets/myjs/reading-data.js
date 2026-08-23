/* ============================================================
   READING DATA — this is the ONLY file you edit to manage the
   Reading page. No build step: just edit and refresh.
   ============================================================ */

/* ─────────────────────────────────────────────────────────────
   1) AMAZON AFFILIATE TAG
   👉 PASTE YOUR AMAZON ASSOCIATES TAG BELOW (between the quotes).
      Example: "aliflab-20"
   Leave it as "YOUR_AFFILIATE_TAG" and no tag will be added yet
   (links still work, just without your affiliate attribution).
   ───────────────────────────────────────────────────────────── */
const AMAZON_AFFILIATE_TAG = "YOUR_AFFILIATE_TAG";

/* ─────────────────────────────────────────────────────────────
   2) BOOKS
   Add one object per book. Fields:
     title       (required)  — book title
     author      (required)  — author name(s)
     coverImage  (required)  — path to a cover image, e.g.
                               "../assets/images/reading/atomic-habits.jpg"
                               (drop your cover files in that folder)
     ratings     (required)  — your scores out of 5. Include only the
                               categories you have; missing rows are hidden:
                               { content, information, writing, story, overall }
     amazonUrl   (required)  — plain Amazon product URL; the affiliate
                               tag above is appended automatically.
     notes       (optional)  — a short line of your thoughts.
   ───────────────────────────────────────────────────────────── */
const READING_BOOKS = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "../assets/images/reading/atomic-habits.jpg",
    ratings: { content: 4, information: 5, writing: 4, overall: 4.5 },
    amazonUrl: "https://www.amazon.com/dp/0735211299",
    notes: "Practical, actionable framework for building tiny habits that compound."
  },
  {
    title: "Blue Ocean Strategy",
    author: "W. Chan Kim & Renée Mauborgne",
    coverImage: "../assets/images/reading/blue-ocean-strategy.jpg",
    ratings: { content: 5, information: 4, writing: 3 },
    amazonUrl: ""
  },
  {
    title: "Crushing It!",
    author: "Gary Vaynerchuk",
    coverImage: "../assets/images/reading/crushing-it.jpg",
    ratings: { content: 4, information: 5, writing: 3.5 },
    amazonUrl: ""
  },
  {
    title: "Eat That Frog!",
    author: "Brian Tracy",
    coverImage: "../assets/images/reading/eat-that-frog.jpg",
    ratings: { content: 5, information: 5, writing: 5 },
    amazonUrl: ""
  },
  {
    title: "Google Guys",
    author: "Richard L. Brandt",
    coverImage: "../assets/images/reading/google-guys.jpg",
    ratings: { content: 3, information: 4, writing: 4, overall: 3.5 },
    amazonUrl: ""
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    coverImage: "../assets/images/reading/how-to-win-friends-and-influence-people.jpg",
    ratings: { content: 4.5, information: 4.5, writing: 5, overall: 4.9 },
    amazonUrl: ""
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverImage: "../assets/images/reading/the-alchemist.jpg",
    ratings: { content: 5, information: 5, writing: 5, story: 4.5 },
    amazonUrl: ""
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    coverImage: "../assets/images/reading/the-design-of-everyday-things.jpg",
    ratings: { content: 5, information: 5, writing: 5, overall: 5 },
    amazonUrl: ""
  },
  {
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    coverImage: "../assets/images/reading/the-subtle-art.jpg",
    ratings: { content: 5, information: 5, writing: 4, overall: 4.6 },
    amazonUrl: ""
  },
  {
    title: "The Theory of Everything",
    author: "Stephen Hawking",
    coverImage: "../assets/images/reading/the-theory-of-everything.jpg",
    ratings: { content: 3, information: 4, writing: 3 },
    amazonUrl: ""
  },
  {
    title: "Who Moved My Cheese?",
    author: "Spencer Johnson",
    coverImage: "../assets/images/reading/who-moved-my-cheese.jpg",
    ratings: { content: 5, information: 4, writing: 5 },
    amazonUrl: ""
  }
];
