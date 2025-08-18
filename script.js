(function () {
  const scoreEl = document.getElementById('score');
  const tapBtn  = document.getElementById('tap-btn');
  const resetBtn = document.getElementById('reset-btn');
  const shareBtn = document.getElementById('share-btn');

  // Читаем/пишем локальный прогресс
  const LS_KEY = 'tap_game_score_v1';
  let score = Number(localStorage.getItem(LS_KEY) || 0);
  render();

  // Инициализируем Telegram WebApp, если открыто внутри Telegram
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
  if (tg) {
    try {
      tg.expand();
      // Настраиваем главную кнопку Telegram на «Отправить результат»
      tg.MainButton.setText('Отправить результат');
      tg.MainButton.hide(); // покажем после первого тапа
      tg.MainButton.onClick(() => {
        const payload = { type: 'score', score, user: tg.initDataUnsafe?.user || null };
        tg.sendData(JSON.stringify(payload));
      });

      // Подстройка темы
      document.body.style.background = tg.themeParams?.bg_color || '#0b0f14';
    } catch (e) {
      console.warn('Telegram WebApp init error:', e);
    }
  }

  function render() {
    scoreEl.textContent = String(score);
  }

  function bump(hard = false) {
    // Вибро: сначала нативный, затем Telegram Haptics
    if (navigator.vibrate) {
      navigator.vibrate(hard ? 30 : 10);
    }
    if (tg && tg.HapticFeedback) {
      const api = tg.HapticFeedback;
      if (hard && api.notificationOccurred) api.notificationOccurred('success');
      else if (api.impactOccurred) api.impactOccurred('light');
    }
  }

  tapBtn.addEventListener('click', () => {
    score += 1;
    localStorage.setItem(LS_KEY, String(score));
    render();
    bump(false);
    if (tg) tg.MainButton.show();
  });

  resetBtn.addEventListener('click', () => {
    score = 0;
    localStorage.setItem(LS_KEY, '0');
    render();
    bump(true);
    if (tg) tg.MainButton.hide();
  });

  shareBtn.addEventListener('click', () => {
    const text = `Мой счёт в Tap Game: ${score}`;
    // Внутри Telegram пошлём данные боту, в браузере — системный share
    if (tg) {
      tg.sendData(JSON.stringify({ type: 'share', score }));
      bump(true);
      return;
    }
    if (navigator.share) {
      navigator.share({ title: 'Tap Game', text });
    } else {
      // Фоллбек: копирование в буфер
      const dummy = document.createElement('textarea');
      dummy.value = text;
      document.body.appendChild(dummy);
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      alert('Скопировано в буфер обмена');
    }
  });
})();
