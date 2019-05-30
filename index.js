const number = document.getElementById('number');
let counter = 0;

function main(e) {
  if (e.target.matches('#resetbtn')) {
    counter = 0;
  }
  else {
    e.preventDefault(); //otherwise with many clicks it highlights the counter number
    counter++;
  }
  number.textContent = counter;
}

window.addEventListener('touchstart', main, {passive: false, useCapture: false});
document.addEventListener('mousedown', main, false);
window.addEventListener('keydown', e => {
  if (e.keyCode === 32) {
    counter++;
    number.textContent = counter;
  }
}, false);