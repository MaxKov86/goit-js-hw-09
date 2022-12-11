import '../css/common.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector(`.form`),
  inputD: document.querySelector(`input[name=delay]`),
  inputS: document.querySelector(`input[name=step]`),
  inputA: document.querySelector(`input[name=amount]`),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.inputD.addEventListener('submit', onFormSubmit);
refs.inputS.addEventListener('submit', onFormSubmit);
refs.inputA.addEventListener('submit', onFormSubmit);

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onFormSubmit(e) {
  e.preventDefault();

  let delay = parseInt(refs.inputD.value);
  const step = parseInt(refs.inputS.value);
  const amount = parseInt(refs.inputA.value);

  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.info(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.info(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    delay += step;
  }
}
