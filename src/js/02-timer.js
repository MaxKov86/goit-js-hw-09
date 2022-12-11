import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "../css/common.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    startBtn : document.querySelector('button[data-start]'),
    datePicker : document.querySelector('#datetime-picker'),
    timerFace : document.querySelector('.timer'),
};

const selectedDates = [];
let futureDate = null;
let deltaTime = null;

flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);
        if (selectedDates[0] <= new Date()) {
            Notify.info("Please choose a date in the future");
            refs.startBtn.disabled = true;
        }
    
        selectedDates.push(new Date());
        futureDate = selectedDates[0].getTime();
        console.log(futureDate);
        refs.startBtn.disabled = false;
    },
});

class Timer {
    constructor({onTick}) {
        this.intervalId = null;
        this.isActive = false;
        this.onTick = onTick;
    }

    start() {
        
        if (this.isActive) {
            return;
        }

        this.isActive = true;
        const targetDate = futureDate;
    
        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = targetDate - currentTime;
            const time = convertMs(deltaTime)

            if (deltaTime <= 1000) {
                clearInterval(this.intervalId)
                this.isActive = false;
            }

            this.onTick(time)

        }, 1000)

    }
}

const timer = new Timer({
    onTick: updateTimerFace
});

refs.startBtn.addEventListener(`click`, onStartClick)


function updateTimerFace({ days, hours, minutes, seconds }) {
    refs.timerFace.textContent = `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
}

function onStartClick() {
    timer.start()
}

function addLeadingZero(value) {
    return String(value).padStart(2, `0`);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}