/**
 * github-stats.js
 *
 * Computes the GitHub activity stats shown in the retro-terminal widget
 * (Total Pushes, Active Days, Current Streak, Longest Streak) and writes
 * them into our own stat cards.
 *
 * Root cause this works around: github-calendar-parser looks for
 * `data-count` on each ContributionCalendar-day cell, but GitHub's current
 * HTML only carries `data-level` (0-4). The exact contribution count lives
 * in the adjacent <tool-tip> custom element's text content, so we read it
 * from there instead.
 *
 * Loaded before the github-calendar library; exposes
 * `window.patchGitHubStats`, called inside the GitHubCalendar() .then()
 * callback once the calendar HTML (and its tooltips) are in the DOM.
 */

(function () {
  'use strict';

  /* === 1. Parse contribution data from the rendered DOM === */
  function buildDayMap() {
    var map = {};

    // Seed from td cells: gives us date + binary active/inactive (data-level > 0)
    var tds = document.querySelectorAll('td.ContributionCalendar-day[data-date]');
    tds.forEach(function (td) {
      var date  = td.getAttribute('data-date');
      var level = parseInt(td.getAttribute('data-level') || '0', 10);
      if (date) map[td.id] = { date: date, count: level > 0 ? null : 0 };
    });

    // Enhance with exact counts from <tool-tip> siblings.
    // GitHub HTML places these as siblings inside <tr>; the browser's table
    // parser foster-parents them before the <table> but they stay in the DOM
    // and keep their `for` attribute pointing to the td's id.
    var tips = document.querySelectorAll('tool-tip[for]');
    tips.forEach(function (tip) {
      var id   = tip.getAttribute('for');
      var cell = map[id];
      if (!cell) return;
      var text  = (tip.textContent || tip.innerText || '').trim();
      var match = text.match(/(\d+)\s+contribution/i);
      cell.count = match ? parseInt(match[1], 10) : 0;
    });

    return map;
  }

  /* === 2. Compute total pushes, active days, current & longest streaks === */
  function computeStats(map) {
    // Build a date-sorted array; ignore future dates
    var today = new Date().toISOString().slice(0, 10);
    var days  = [];
    for (var key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        var d = map[key];
        if (d.date <= today) days.push(d);
      }
    }
    days.sort(function (a, b) { return a.date < b.date ? -1 : 1; });

    if (!days.length) return null;

    // Helper: is this day active? null = data-level > 0 but no tooltip count found
    function active(d) { return d.count === null || d.count > 0; }

    // Total pushes (sum of exact counts) and active-day count
    var total = 0, activeDays = 0;
    days.forEach(function (d) {
      if (d.count && d.count > 0) { total += d.count; }
      if (active(d)) { activeDays++; }
    });

    // Longest streak — most consecutive active days
    var longestLen = 0;
    var streak = 0;
    days.forEach(function (d) {
      if (active(d)) {
        streak++;
        if (streak > longestLen) { longestLen = streak; }
      } else {
        streak = 0;
      }
    });

    // Current streak — scan backwards; let today slide if not yet committed
    var currLen = 0;
    var hitActive = false;
    for (var i = days.length - 1; i >= 0; i--) {
      var day = days[i];
      if (active(day)) {
        hitActive = true;
        currLen++;
      } else {
        if (!hitActive && day.date === today) continue; // today: no commit yet
        break;
      }
    }

    return {
      total      : total,
      activeDays : activeDays,
      longestLen : longestLen,
      currLen    : currLen
    };
  }

  /* === 3. Write stats into our terminal stat cards === */
  function setNum(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function render(stats) {
    setNum('gh-stat-total',   stats.total);
    setNum('gh-stat-active',  stats.activeDays);
    setNum('gh-stat-current', stats.currLen);
    setNum('gh-stat-longest', stats.longestLen);
  }

  /* === Public entry point === */
  window.patchGitHubStats = function () {
    var map   = buildDayMap();
    var stats = computeStats(map);
    if (!stats) return;
    render(stats);
  };
})();
