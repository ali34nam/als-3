(function () {
  document.documentElement.classList.add('js');

  /* ---------- True viewport width (fixes fixed-position sizing on engines where
     window.innerWidth over-reports vs. the actual layout viewport) ---------- */
  function setViewportWidthVar() {
    document.documentElement.style.setProperty('--vw-px', document.documentElement.clientWidth + 'px');
    document.documentElement.style.setProperty('--vh-px', document.documentElement.clientHeight + 'px');
  }
  setViewportWidthVar();
  window.addEventListener('resize', setViewportWidthVar);

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (window.scrollY > 20) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  }
  function toggleMobileNav() {
    var open = mobileNav.classList.toggle('is-open');
    burger.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', toggleMobileNav);
  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var navSections = navLinks
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  if (navSections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = '#' + entry.target.id;
          var link = navLinks.filter(function (l) { return l.getAttribute('href') === id; })[0];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navSections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.card, .step, .gphoto, .why__content, .why__media, .contacts__info, .contacts__map, .price-group, .faq__item, .booking__intro, .booking__form'
  );
  revealTargets.forEach(function (el) { el.setAttribute('data-reveal', ''); });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Promo expiry ---------- */
  var promo = document.getElementById('promo');
  var promoOption = document.querySelector('.opt-promo');
  if (promo) {
    var until = new Date(promo.getAttribute('data-until'));
    if (!isNaN(until.getTime()) && Date.now() > until.getTime()) {
      promo.remove();
      if (promoOption) promoOption.remove();
    }
  }

  /* ---------- "Узнать цену / Записаться" buttons -> booking form ---------- */
  var serviceSelect = document.getElementById('f-service');
  var nameInput = document.getElementById('f-name');
  var bookingSection = document.getElementById('booking');

  document.querySelectorAll('.js-book').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var service = btn.getAttribute('data-service');
      if (service && serviceSelect) {
        var matched = Array.prototype.slice.call(serviceSelect.options).some(function (opt) {
          if (opt.text === service || opt.value === service) {
            serviceSelect.value = opt.value || opt.text;
            return true;
          }
          return false;
        });
        if (!matched) serviceSelect.value = '';
      }
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(function () {
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 450);
      }
    });
    btn.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && btn.getAttribute('role') === 'button') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 4200);
  }

  /* ---------- Booking form ---------- */
  var form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = {
        name: document.getElementById('f-name'),
        car: document.getElementById('f-car')
      };
      var valid = true;
      Object.keys(fields).forEach(function (key) {
        var input = fields[key];
        var field = input.closest('.field');
        var errorEl = field.querySelector('.field__error');
        if (!input.value.trim()) {
          field.classList.add('has-error');
          if (errorEl) errorEl.textContent = 'Заполните это поле';
          valid = false;
        } else {
          field.classList.remove('has-error');
          if (errorEl) errorEl.textContent = '';
        }
      });
      if (!valid) return;

      var name = fields.name.value.trim();
      var car = fields.car.value.trim();
      var service = document.getElementById('f-service').value.trim();
      var date = document.getElementById('f-date').value;
      var comment = document.getElementById('f-comment').value.trim();

      var lines = ['Здравствуйте! Хочу записаться в ALS Detailing.'];
      lines.push('Имя: ' + name);
      lines.push('Авто: ' + car);
      if (service) lines.push('Услуга: ' + service);
      if (date) {
        var d = new Date(date + 'T00:00:00');
        var formatted = isNaN(d.getTime())
          ? date
          : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
        lines.push('Желаемая дата: ' + formatted);
      }
      if (comment) lines.push('Комментарий: ' + comment);

      var message = lines.join('\n');

      var copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(function () {
          copied = true;
        }).catch(function () {});
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = message;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copied = true;
        } catch (err) {}
      }

      window.open('https://t.me/als_mf?text=' + encodeURIComponent(message), '_blank', 'noopener');
      showToast(copied ? 'Текст скопирован — если не подставился в Telegram, вставьте его сами' : 'Открываем Telegram — вставьте сообщение вручную, если понадобится');
    });

    ['f-name', 'f-car'].forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (input.value.trim()) {
          field.classList.remove('has-error');
          field.querySelector('.field__error').textContent = '';
        }
      });
    });

    var dateInput = document.getElementById('f-date');
    if (dateInput) {
      var today = new Date();
      var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      dateInput.setAttribute('min', iso);
    }
  }

  /* ---------- Hero video (desktop only, respects reduced-motion / save-data) ---------- */
  var heroVideo = document.getElementById('heroVideo');
  var heroSection = document.querySelector('.hero');
  if (heroVideo) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var isPhone = document.documentElement.clientWidth < 900;

    if (!prefersReducedMotion && !saveData) {
      heroVideo.muted = true;
      heroVideo.setAttribute('muted', '');
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('webkit-playsinline', '');
      heroVideo.addEventListener('playing', function () {
        heroVideo.classList.add('is-loaded');
        if (heroSection) heroSection.classList.add('video-on');
      });
      heroVideo.src = heroVideo.getAttribute(isPhone ? 'data-src-mobile' : 'data-src');
      heroVideo.load();
      var tryPlay = function () { heroVideo.play().catch(function () {}); };
      tryPlay();
      heroVideo.addEventListener('loadeddata', tryPlay);
      heroVideo.addEventListener('canplay', tryPlay);
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && heroVideo.paused) tryPlay();
      });
      // Some mobile browsers block autoplay until the first touch
      document.addEventListener('touchstart', function once() {
        if (heroVideo.paused) tryPlay();
        document.removeEventListener('touchstart', once);
      }, { passive: true });
    }
  }

  /* ---------- Mobile sticky bar ---------- */
  var mobileBar = document.getElementById('mobileBar');
  if (mobileBar && heroSection) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          mobileBar.classList.toggle('is-visible', !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    barObserver.observe(heroSection);
  }
})();
