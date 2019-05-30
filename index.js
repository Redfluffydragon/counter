const number = document.getElementById('number');
const resetbtn = document.getElementById('resetbtn');
const modebtn = document.getElementById('modebtn');
const startpointin = document.getElementById('startpointin');

function gotchem(item, defalt, type=localStorage) {
  let getthething = JSON.parse(type.getItem(item));
  if (getthething === null || getthething === undefined) return defalt; 
  return getthething;
}

const modes = 'Up Down Up/Down'.split(' '); //I'm not sure this is better or worse.
let mode = gotchem('mode', 0); //start with up
modebtn.textContent = modes[mode];
if (mode === 2) {
  minusdiv.classList.remove('none');
  plusdiv.classList.remove('none');
}

let counter = gotchem('counter', 0);
number.textContent = counter;

let startpoint = gotchem('startpoint', 0);
if (startpoint != 0) startpointin.value = startpoint; //!= because I'm not sure how iOS handles types in and out of localStorage 

function main(e) {
  if (e.target.matches('#resetbtn')) {
    counter = startpointin.value;
    if (counter === '') counter = 0;
  }
  else {
    e.preventDefault();
    startpointin.blur();
    resetbtn.blur();
    if (e.target.matches('#modebtn')) {
      mode++;
      if (mode === 2) {
        minusdiv.classList.remove('none');
        plusdiv.classList.remove('none');
      }
      else {
        minusdiv.classList.add('none');
        plusdiv.classList.add('none');
      }
      if (mode > 2) mode = 0;
      modebtn.textContent = modes[mode];
    }
    else if (e.target.matches('#startpointin')) {
      startpointin.focus(); //yes, this is a weird-ass way to do it.
    }
    else {
      //for some reason counts on touchstart and touchend without this
      if (mode === 0) counter++; //up
      else if (mode === 1) counter--; //down
      else if (mode === 2) { //up/down
        let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        if (window.innerHeight > window.innerWidth) { //portrait
          clientY <= window.innerHeight/2 ? counter++ : counter--;
        }
        else { //landscape and square
          clientX <= window.innerWidth/2 ? counter-- : counter++;
        }
      }
    }
  }
  number.textContent = counter;
}

startpointin.addEventListener('input', () => {
  number.textContent = startpointin.value;
  if (startpointin.value === '') number.textContent = '0';
  counter = number.textContent;
}, false);

window.addEventListener('touchstart', main, {passive: false, useCapture: false});
document.addEventListener('mousedown', main, false);
window.addEventListener('keydown', e => { //use space for counting
  if (e.keyCode === 32) {
    if (mode === 0) counter++;
    else if (mode === 1) counter--;
    number.textContent = counter;
  }
}, false);
window.addEventListener('beforeunload', () => {
  localStorage.setItem('counter', JSON.stringify(counter));
  localStorage.setItem('mode', JSON.stringify(mode));
  startpoint = startpointin.value;
  localStorage.setItem('startpoint', JSON.stringify(startpoint));
}, false);