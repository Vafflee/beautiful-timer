'use strict'

// Theme changer
document.querySelector('.header__theme-btn').addEventListener('click', () => {
    document.querySelector('body').classList.toggle('theme-dark');
});
//

//Clock constants
const longArrow = document.querySelector('.clock__long-arrow');
const shortArrow = document.querySelector('.clock__short-arrow');
const secondArrow = document.querySelector('.clock__second-arrow');

const degH = 360 / 12; 
const degMS = 360 / 60;
//

setInterval(() => {
    const dateNow = new Date();
    const hours = dateNow.getHours();
    const minutes = dateNow.getMinutes();
    const seconds = dateNow.getSeconds();
    const milliseconds = dateNow.getMilliseconds();
    const angleH = -90 + degH * hours + degH / 60 * minutes + degH / 60 / 60 * seconds;
    const angleM = -90 + degMS * minutes + degMS / 60 * seconds + degMS / 60 / 1000 * milliseconds;
    const angleS = -90 + degMS * seconds + degMS / 1000 * milliseconds;

    secondArrow.style.transform = `translate(0, -50%) rotate(${angleS}deg)`;
    longArrow.style.transform = `translate(0, -50%) rotate(${angleM}deg)`;
    shortArrow.style.transform = `translate(0, -50%) rotate(${angleH}deg)`;
}, 10);

// Timer constants
const inputH = document.querySelector('#HH');
const inputM = document.querySelector('#MM');
const inputS = document.querySelector('#SS');

const timerHoursArrow = document.querySelector('.timer__hours-arrow');
const timerMinutesArrow = document.querySelector('.timer__minutes-arrow');
const timerSecondsArrow = document.querySelector('.timer__seconds-arrow');

const tic = 10;
const ticHAngle = 360 / 12 / 60 / 60 / 1000 * tic;
const ticMAngle = 360 / 60 / 60 / 1000 * tic;
const ticSAngle = 360 / 60 / 1000 * tic;
//

let timerActive = false;
let timer;
let ticsLeft = 0;
let startH = inputH.value * 60 * 60 * 1000;
let startM = inputM.value * 60 * 1000;
let startS = inputS.value * 1000;

function setTimerArrows() {
    timerHoursArrow.style.transform = `translate(0, -50%) rotate(${-90 + (ticsLeft * ticHAngle) % 360}deg)`;
    timerMinutesArrow.style.transform = `translate(0, -50%) rotate(${-90 + (ticsLeft * ticMAngle) % 360}deg)`;
    timerSecondsArrow.style.transform = `translate(0, -50%) rotate(${-90 + (ticsLeft * ticSAngle) % 360}deg)`;
}

function timerTransitionOn() {
    timerHoursArrow.style.transition = '1s';
    timerMinutesArrow.style.transition = '1s';
    timerSecondsArrow.style.transition = '1s';
}

function timerTransitionOff() {
    timerHoursArrow.style.transition = '0s';
    timerMinutesArrow.style.transition = '0s';
    timerSecondsArrow.style.transition = '0s';
}

inputH.addEventListener('input', (event) => {
    if (!timerActive) {
        if (isNaN(parseInt(inputH.value))) {
            inputH.value = 0;
        }
        else {
            inputH.value = parseInt(inputH.value);
        }
        if (inputH.value > 12) {
            inputH.value = 12;
        }
        startH = inputH.value * 60 * 60 * 1000;
        startM = inputM.value * 60 * 1000;
        startS = inputS.value * 1000;
        ticsLeft = (startH + startM + startS) / tic;
        setTimerArrows();
    }    
});
inputM.addEventListener('input', (event) => {
    if (!timerActive) {
        if (isNaN(parseInt(inputM.value))) {
            inputM.value = 0;
        }
        else {
            inputM.value = parseInt(inputM.value);
        }
        if (inputM.value > 60) {
            inputM.value = 60;
        }
        startH = inputH.value * 60 * 60 * 1000;
        startM = inputM.value * 60 * 1000;
        startS = inputS.value * 1000;
        ticsLeft = (startH + startM + startS) / tic;
        setTimerArrows();
    }
});
inputS.addEventListener('input', (event) => {
    if (!timerActive) {
        if (isNaN(parseInt(inputS.value))) {
            // console.log(parseInt(inputS.value));
            inputS.value = 0;
        }
        else {
            inputS.value = parseInt(inputS.value);
        }
        if (inputS.value > 60) {
            inputS.value = 60;
        }
        startH = inputH.value * 60 * 60 * 1000;
        startM = inputM.value * 60 * 1000;
        startS = inputS.value * 1000;
        ticsLeft = (startH + startM + startS) / tic;
        setTimerArrows();
    }
});

document.querySelector('.input__start').addEventListener('click', (event) => {
    const btn = event.currentTarget;
    if (timerActive) {
        clearInterval(timer);
        timerTransitionOn()
        btn.classList.toggle('stop');
        timerActive = false;
    }
    else {
        timerActive = true;
        btn.classList.toggle('stop');
        timer = setInterval(() => {
            timerTransitionOff();    
            setTimerArrows();
            inputS.value = Math.floor(ticsLeft * tic / 1000) % 60;
            inputM.value = Math.floor(ticsLeft * tic / 1000 / 60) % 60;
            inputH.value = Math.floor(ticsLeft * tic / 1000 / 60 / 60);
            ticsLeft--;
            if (ticsLeft < 0) {
                inputH.value = 0;
                inputM.value = 0;
                inputS.value = 0;
                clearInterval(timer);
                btn.classList.toggle('stop');
                timerTransitionOn();
                timerActive = false;
                // alert("Time is up!");
                var audio = new Audio('../sound/ding.mp3');
                audio.volume = 0.3;
                audio.play();
            }
        }, tic);
    }
});