/* Category tabs for the "Awards and Certificates" carousel.
   Filtering works by physically swapping which .carousel-item nodes live inside
   .carousel-inner, because Bootstrap indexes slides positionally — merely hiding
   items with CSS would leave prev/next landing on blank slides.

   Note: window.$ is overwritten by assets/plugins/js/jquery.min.js *after*
   bootstrap.min.js loads, so $.fn.carousel is not available here. Everything
   below is plain DOM. Bootstrap's delegated data-api handlers stay bound to
   document, so the prev/next/indicator clicks keep working. */
(function () {
  var CAROUSEL_ID = 'carouselExampleIndicators';

  var carousel = document.getElementById(CAROUSEL_ID);
  if (!carousel) return;

  var inner      = carousel.querySelector('.carousel-inner');
  var indicators = carousel.querySelector('.carousel-indicators');
  var prevBtn    = carousel.querySelector('.carousel-control-prev');
  var nextBtn    = carousel.querySelector('.carousel-control-next');
  var filterBtns = document.querySelectorAll('.cert-filter-btn');
  if (!inner || !indicators) return;

  // Snapshot every slide once, before any mutation — this array is the source of truth.
  var allItems = Array.prototype.slice.call(inner.querySelectorAll('.carousel-item'));

  var STATE_CLASSES = [
    'active',
    'carousel-item-next',
    'carousel-item-prev',
    'carousel-item-left',
    'carousel-item-right'
  ];

  function applyFilter(cat) {
    var matches = allItems.filter(function (item) {
      // data-cat is a space-separated token list, so an item can sit in more
      // than one category (e.g. the AWS AI cert is both Cloud & IT and AI & Data).
      var cats = (item.getAttribute('data-cat') || '').split(' ');
      return cat === '*' || cats.indexOf(cat) !== -1;
    });

    // Detach everything, then re-attach only the matching slides.
    while (inner.firstChild) inner.removeChild(inner.firstChild);

    allItems.forEach(function (item) {
      STATE_CLASSES.forEach(function (c) { item.classList.remove(c); });
    });

    matches.forEach(function (item, i) {
      if (i === 0) item.classList.add('active');
      inner.appendChild(item);
    });

    // Rebuild indicators *in place* — Bootstrap caches the <ol> node itself.
    var html = '';
    for (var i = 0; i < matches.length; i++) {
      html += '<li data-target="#' + CAROUSEL_ID + '" data-slide-to="' + i + '"' +
              (i === 0 ? ' class="active"' : '') + '></li>';
    }
    indicators.innerHTML = html;

    // A lone dot conveys nothing; the arrows stay put and simply fade (see syncNav).
    indicators.style.display = matches.length > 1 ? '' : 'none';

    schedule();
  }

  // ── Arrow state ─────────────────────────────────────────────────────────────
  // The carousel is data-wrap="false", so at either end there is no slide to move
  // to. Fade and disable the corresponding arrow rather than leaving it live.
  function setDisabled(btn, disabled) {
    if (!btn) return;
    btn.classList.toggle('cert-nav-disabled', disabled);
    btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    if (disabled) btn.setAttribute('tabindex', '-1');
    else btn.removeAttribute('tabindex');
  }

  function syncNav() {
    var items  = inner.children;
    var count  = items.length;
    var active = inner.querySelector('.carousel-item.active');
    var index  = active ? Array.prototype.indexOf.call(items, active) : 0;

    setDisabled(prevBtn, index <= 0);
    setDisabled(nextBtn, index >= count - 1);

    // Centre the arrows on the image rather than on the whole stack. .carousel-inner
    // is order:1 so it starts at the carousel's top edge, which makes half the image
    // height the image's own vertical centre — the caption and indicator row below it
    // (and slide heights that vary ~2x between landscape and portrait scans) then
    // stop dragging the arrows off centre.
    var img = active && active.querySelector('img');
    var h   = img ? img.offsetHeight : 0;
    if (h > 0) carousel.style.setProperty('--cert-arrow-top', (h / 2) + 'px');
    else carousel.style.removeProperty('--cert-arrow-top');
  }

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      syncNav();
    });
  }

  // Bootstrap fires slid.bs.carousel through jQuery.trigger(), which never reaches
  // addEventListener — so watch the DOM instead. This catches every slide change,
  // whatever drove it: an arrow, an indicator dot, or our own applyFilter rebuild.
  new MutationObserver(schedule).observe(inner, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  // Image height decides the layout, and it is only known once each image has loaded.
  window.addEventListener('resize', schedule);
  allItems.forEach(function (item) {
    var img = item.querySelector('img');
    if (img && !img.complete) img.addEventListener('load', schedule);
  });

  Array.prototype.forEach.call(filterBtns, function (btn) {
    btn.addEventListener('click', function () {
      Array.prototype.forEach.call(filterBtns, function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      applyFilter(this.getAttribute('data-filter'));
    });
  });

  // Generate the initial indicator list from the real slide count.
  applyFilter('*');
})();
