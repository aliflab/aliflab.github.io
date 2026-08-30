/* ============================================================
   READING PAGE RENDERER
   Reads READING_BOOKS from reading-data.js and builds the
   responsive card grid. Edit data in reading-data.js, not here.

   A book with photos in its `highlights` array gets a gradient
   ring on its cover; clicking it hands the book to
   reading-highlights.js, which opens the story viewer.
   ============================================================ */
(function () {
  "use strict";

  var grid = document.getElementById("reading-list");
  if (!grid) return;

  var empty = document.getElementById("reading-empty");
  var FALLBACK_COVER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23e9eef5'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23a7b4c4'%3ENo cover%3C/text%3E%3C/svg%3E";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var books = (typeof READING_BOOKS !== "undefined") ? READING_BOOKS : [];

  // Escape text before injecting into HTML.
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // "2026-03-14" -> "14 Mar 2026". Anything unparseable yields "" so a typo
  // shows nothing rather than "Invalid Date". Parsed by hand rather than with
  // Date() because a bare YYYY-MM-DD is read as UTC and can slip a day.
  function formatDate(value) {
    var m = /^\s*(\d{4})-(\d{2})-(\d{2})\s*$/.exec(String(value || ""));
    if (!m) return "";
    var month = Number(m[2]);
    var day = Number(m[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return "";
    return day + " " + MONTHS[month - 1] + " " + m[1];
  }

  function hasHighlights(b) {
    return !!(b && b.highlights && b.highlights.length);
  }

  // Format a rating value (e.g. 4 or 4.5) as "X/5".
  function score(v) {
    var n = Number(v);
    if (isNaN(n)) return "–/5";
    return (Math.round(n * 10) / 10) + "/5";
  }

  function ratingRow(label, value, isOverall) {
    if (value === null || value === undefined || value === "") return "";
    return (
      '<div class="reading-rating-row' + (isOverall ? " reading-rating-overall" : "") + '">' +
        '<span class="reading-rating-label">' + label + "</span>" +
        '<span class="reading-rating-val">' + score(value) + "</span>" +
      "</div>"
    );
  }

  function cardHtml(b, i) {
    var r = b.ratings || {};
    var cover = esc(b.coverImage || "");
    var title = esc(b.title || "Untitled");
    var notes = b.notes
      ? '<p class="reading-notes">' + esc(b.notes) + "</p>"
      : "";

    // Without highlights the cover stays a plain, non-interactive block.
    var lit = hasHighlights(b);
    var date = lit ? formatDate(b.highlightDate) : "";
    var wrapAttrs = lit
      ? ' class="reading-cover-wrap has-highlight" role="button" tabindex="0"' +
        ' data-book="' + i + '" aria-label="View highlights for ' + title + '"'
      : ' class="reading-cover-wrap"';
    var datePill = date
      ? '<span class="reading-highlight-date">' + esc(date) + "</span>"
      : "";

    return (
      '<article class="reading-card">' +
        "<div" + wrapAttrs + ">" +
          '<img class="reading-cover" src="' + cover + '" alt="' + title + ' cover" loading="lazy">' +
          datePill +
        "</div>" +
        '<div class="reading-card-body">' +
          '<h3 class="reading-title">' + title + "</h3>" +
          '<p class="reading-author">by ' + esc(b.author || "Unknown") + "</p>" +
          '<div class="reading-ratings">' +
            ratingRow("Content", r.content) +
            ratingRow("Information", r.information) +
            ratingRow("Writing", r.writing) +
            ratingRow("Story", r.story) +
            ratingRow("Overall", r.overall, true) +
          "</div>" +
          notes +
        "</div>" +
      "</article>"
    );
  }

  if (!books.length) {
    if (empty) empty.hidden = false;
    return;
  }

  grid.innerHTML = books.map(cardHtml).join("");

  // Swap in a placeholder for any cover that fails to load.
  function applyFallback(img) {
    if (img.getAttribute("data-fallback")) return;
    img.setAttribute("data-fallback", "1");
    img.src = FALLBACK_COVER;
  }
  Array.prototype.forEach.call(grid.querySelectorAll(".reading-cover"), function (img) {
    img.addEventListener("error", function () { applyFallback(img); });
    if (img.complete && img.naturalWidth === 0) applyFallback(img); // already failed
  });

  // One delegated pair of listeners for every ringed cover.
  function openFrom(target) {
    if (!target || !window.ReadingHighlights) return;
    var book = books[Number(target.getAttribute("data-book"))];
    window.ReadingHighlights.open(book, target);
  }

  grid.addEventListener("click", function (e) {
    var wrap = e.target.closest(".reading-cover-wrap.has-highlight");
    if (wrap) openFrom(wrap);
  });

  grid.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var wrap = e.target.closest(".reading-cover-wrap.has-highlight");
    if (!wrap) return;
    e.preventDefault();   // stop Space scrolling the page
    openFrom(wrap);
  });
})();
