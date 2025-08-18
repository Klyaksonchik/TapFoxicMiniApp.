let counter = 0;
const counterEl = document.getElementById('counter');
const tapEl = document.getElementById('tap');
const shareBtn = document.getElementById('share');
const resetBtn = document.getElementById('reset');
const tapArea = document.querySelector('.tap-area');

// Счётчик по клику на картинку
tapEl.addEventListener('click', (event) => {
  counter++;
  counterEl.textContent = counter;

  createParticles(event);
});

// Поделиться
shareBtn.addEventListener('click', () => {
  const text = `Мой счёт в TapFox: ${counter}! 🦊`;
  if (navigator.share) {
    navigator.share({
      title: 'TapFox',
      text: text,
      url: window.location.href
    });
  } else {
    alert('Поделиться можно так: ' + text);
  }
});

// Сброс
resetBtn.addEventListener('click', () => {
  counter = 0;
  counterEl.textContent = counter;
});

// Функция генерации частиц
function createParticles(event) {
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.textContent = '💖'; // тут можно заменить на ⭐ или 🔥

    // Случайное направление разлёта
    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 30;
    const x = Math.cos(angle) * distance + 'px';
    const y = Math.sin(angle) * distance + 'px';

    particle.style.setProperty('--x', x);
    particle.style.setProperty('--y', y);

    // Позиция появления — центр картинки
    const rect = tapEl.getBoundingClientRect();
    particle.style.left = rect.width / 2 + 'px';
    particle.style.top = rect.height / 2 + 'px';

    tapArea.appendChild(particle);

    // Удаляем через 1с
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
}
