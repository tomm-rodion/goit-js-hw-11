import Notiflix from 'notiflix';
import { refs as ref } from '../index';

const refs = {
  btnStory: document.querySelector('.form__story'),
  menuStory: document.querySelector('.history'),
  modalCont: document.querySelector('.modal'),
};

refs.btnStory.addEventListener('click', onClickStory); //слухач на кнопку історії пошуку
refs.modalCont.addEventListener('click', onClockTextStory); //на відкриття модального вікна історії пошуку

function onClockTextStory(evt) {
  //   console.log(evt.target.textContent);
  if (evt.target.nodeName === 'P' || evt.target.nodeName === 'LI') {
    ref.formInput[0].value = evt.target.textContent;
    ref.btnSum.removeAttribute('disabled');
    refs.modalCont.classList.add('visually-hidden');
    ref.body.classList.remove('noScroll');
  } else if (evt.target.nodeName === 'DIV') {
    refs.modalCont.classList.add('visually-hidden');
    ref.body.classList.remove('noScroll');
  }
}

function onClickStory(evt) {
  evt.preventDefault();
  if (!historyCheck()) {
    Notiflix.Notify.failure('Photo search history is empty =(');
    return;
  }
  refs.menuStory.innerHTML = '';
  ref.body.classList.add('noScroll');
  refs.menuStory.classList.remove('visually-hidden');
  refs.modalCont.classList.remove('visually-hidden');
  getStory();
}

function historyCheck() {
  let truth = true;
  for (let i = 0; i < 10; i += 1) {
    if (localStorage.getItem(`story${i}`) === null) {
      truth = false;
    } else {
      return true;
    }
  }
  return truth;
}

function getStory() {
  const arrStory = [];

  for (let i = 0; i <= 10; i += 1) {
    const g = localStorage.getItem(`story${i}`);
    if (g !== null) {
      arrStory.push(g);
    }
  }
  creatElmHtml(arrStory);
}

function creatElmHtml(arrStory) {
  const markup = [];

  arrStory.map(element =>
    markup.push(
      `<ul class="list__story">
        <li class="item__story"><p class="text__story">${element}</p></li>
      </ul>`
    )
  );

  addElmHtml(markup.join(' '));
}

function addElmHtml(arrElm) {
  refs.menuStory.insertAdjacentHTML('beforeend', arrElm);
}
