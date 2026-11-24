(function () {
  var btn  = document.getElementById('themeToggle');
  var DARK = 'dark-mode';
  var KEY  = 'theme';

  function applyTheme(dark) {
    document.body.classList.toggle(DARK, dark);
    var icon = btn.querySelector('i');
    icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {} // storage blocked: theme just won't persist
  }

  // Sync icon with whatever state was restored by the early inline script
  applyTheme(document.body.classList.contains(DARK));

  btn.addEventListener('click', function () {
    applyTheme(!document.body.classList.contains(DARK));
  });
})();
