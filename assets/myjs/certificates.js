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
  var controls   = carousel.querySelectorAll('.carousel-control-prev, .carousel-control-next');
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

    // With a single slide there is nothing to navigate to.
    var navigable = matches.length > 1;
    indicators.style.display = navigable ? '' : 'none';
    Array.prototype.forEach.call(controls, function (c) {
      c.style.display = navigable ? '' : 'none';
    });
  }

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
