let counter = 0;
const counterEl = document.getElementById('counter');
const tapEl = document.getElementById('tap');

tapEl.addEventListener('click', () => {
  counter++;
  counterEl.textContent = counter;
});
