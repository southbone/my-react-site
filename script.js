window.addEventListener('DOMContentLoaded', () => {
  // --- SPLASH ANIMATION ---
  const splashLogo = document.getElementById('splash-logo');
  const splashImg = splashLogo.querySelector('img');
  const mainLogo = document.getElementById('main-logo');
  const content = document.getElementById('content');
  let latestDict = null;

  content.classList.add('hidden');
  splashLogo.classList.remove('splash-animate', 'splash-hide');
  splashLogo.style.removeProperty('--target-x');
  splashLogo.style.removeProperty('--target-y');
  splashLogo.style.opacity = '1';
  splashLogo.style.pointerEvents = 'auto';
  splashLogo.style.display = 'block';

  // Через 0.5s — move+scale
  setTimeout(() => {
    // Координаты центра splash-логотипа
    const splashRect = splashImg.getBoundingClientRect();
    const splashCenterX = splashRect.left + splashRect.width / 2;
    const splashCenterY = splashRect.top + splashRect.height / 2 + window.scrollY;

    // Координаты центра целевого блока для логотипа
    const targetImg = document.getElementById('main-logo');
    const targetRect = targetImg.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2 + window.scrollY;

    const scale = 0.35;
    const splashWidth = splashRect.width;
    const splashHeight = splashRect.height;

    const correctedX = targetCenterX - splashCenterX + 710;
    const correctedY = targetCenterY - splashCenterY +385;

    splashLogo.style.setProperty('--target-x', `${correctedX}px`);
    splashLogo.style.setProperty('--target-y', `${correctedY}px`);
    splashLogo.classList.add('splash-animate');

    // Через 1.5s после начала движения — hide + show content
    setTimeout(() => {
      splashLogo.classList.remove('splash-animate');
      splashLogo.classList.add('splash-hide');
      splashLogo.style.display = 'none'; // Полностью убрать из потока
      content.classList.remove('hidden');
      if (latestDict) updateRandomSlogan(latestDict);
      setTimeout(() => {
        content.classList.add('visible');
        const nickname = document.getElementById('nickname');
        nickname.classList.add('show');
        const footer = document.getElementById('site-footer');
        if (footer) footer.classList.add('visible');
      }, 100); // небольшая задержка перед началом появления
    }, 1500);
  }, 500);

  // --- THEME SWITCHER ---
  const themeBtn = document.getElementById('theme-btn');
  const body = document.body;
  function setTheme(theme) {
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(theme+'-theme');
    localStorage.setItem('theme', theme);
  }
  // Инициализация темы
  setTheme(localStorage.getItem('theme') || 'dark');

  function updateRandomSlogan(dict) {
    const slogans = dict.slogans;
    const sloganEl = document.querySelector('[data-slogan]');
    if (!slogans || !Array.isArray(slogans) || !sloganEl) return;
    const randomText = slogans[Math.floor(Math.random() * slogans.length)];
    sloganEl.textContent = randomText;
  }

  themeBtn.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // --- LANGUAGE SWITCHER ---
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  const langOptions = document.querySelectorAll('.lang-option');
  let currentLang = localStorage.getItem('lang') || 'en';

  function loadLang(lang) {
    const fileMap = { en: 'eng.json', ru: 'ru.json', es: 'es.json' };
    fetch(fileMap[lang])
      .then(r => r.json())
      .then(dict => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          if (dict[key]) el.textContent = dict[key];
        });
        localStorage.setItem('lang', lang);
        currentLang = lang;
        latestDict = dict;
        // Always update slogan, even on first load
        updateRandomSlogan(dict);
      })
      .catch(err => {
        // If language file fails to load, try to update slogan anyway with empty dict
        console.error('Failed to load language file:', err);
        updateRandomSlogan({});
      });
  }
  // Ensure slogan loads even on first launch
  loadLang(currentLang);

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Не даём всплыть
    langMenu.classList.toggle('show');
  });
  langOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = btn.getAttribute('data-lang');
      loadLang(lang);
      langMenu.classList.remove('show');
    });
  });
  // Скрытие меню при клике вне
  document.addEventListener('click', (e) => {
    if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
      langMenu.classList.remove('show');
    }
  });

  // --- ABOUT MODAL ---
  const aboutBtn = document.getElementById('about-btn');
  const aboutModal = document.getElementById('about-modal');
  const closeAbout = document.getElementById('close-about');
  aboutBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
  });
  closeAbout.addEventListener('click', () => {
    aboutModal.classList.add('hidden');
  });
  // Закрытие по клику вне модалки или по Esc
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) aboutModal.classList.add('hidden');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') aboutModal.classList.add('hidden');
  });
  // --- NICKNAME LINK CLICK HANDLER ---
  const nicknameLink = document.getElementById('nickname-link');
  let clickCount = 0;

  if (nicknameLink) {
    nicknameLink.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      if (clickCount === 5) {
        nicknameLink.textContent = 'ЫЩГЕРИЩТУ';
        clickCount = 0;
      }
    });
  }
  // --- SLOGAN RANDOMIZER ---
  /*
  fetch('motiv.json')
    .then(response => response.json())
    .then(data => {
      const slogans = data.slogans;
      const random = slogans[Math.floor(Math.random() * slogans.length)];
      const sloganEl = document.querySelector('.slogan');
      if (sloganEl) {
        sloganEl.setAttribute('data-i18n', random);
        sloganEl.textContent = random;
      }
    });
  */
});

const portfolioBtn = document.getElementById('portfolio-btn');
const portfolioModal = document.getElementById('portfolio-modal');
const closePortfolio = document.getElementById('close-portfolio');

if (portfolioBtn && portfolioModal && closePortfolio) {
  portfolioBtn.addEventListener('click', () => {
    portfolioModal.classList.remove('hidden');
  });

  closePortfolio.addEventListener('click', () => {
    portfolioModal.classList.add('hidden');
  });

  portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) portfolioModal.classList.add('hidden');
  });
}