import { fetchApi } from './js/fetchImages';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

export const refs = {
  formInput: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('#scrollArea'),
  btnSum: document.querySelector('.form__btn'),
  btnDelletResult: document.querySelector('.btn__dellet'),
  menuStory: document.querySelector('.history'),
  modalCont: document.querySelector('.modal'),
  body: document.querySelector('body'),
};

refs.btnDelletResult.addEventListener('click', onClick); //слухач на кнопку очишення контенту
refs.btnSum.addEventListener('click', onSubmit); //слухач на кнопку відправки форми пошуку
refs.formInput.addEventListener('input', onInput); //слухач на отримання ведених даних з імпуту

refs.btnSum.setAttribute('disablet', true); //кнопка не активна
refs.btnDelletResult.style.display = 'none'; //кнопка поки що не видима, скрита

let page = 1;
let numberStory = 1;

if (!localStorage.getItem(numberStory) === null) {
  numberStory = localStorage.getItem(numberStory);
}

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 0.8,
};

let observer = new IntersectionObserver(onLoad, options);
// console.log(observer);
function onInput() {
  refs.btnSum.setAttribute('disabled', true);
  if (auditNullInput()) {
    refs.btnSum.removeAttribute('disabled');
  }
}
function auditNullInput() {
  const a = [...refs.formInput[0].value];
  let truFal = true;
  if (a.length === 0) {
    truFal = false;
  }
  a.forEach(element => {
    if (element === ' ') {
      truFal = false;
    } else {
      truFal = true;
    }
  });
  return truFal;
}

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      importElm();
    }
  });
}
function onClick(evt) {
  evt.preventDefault();
  refs.btnSum.setAttribute('disabled', true);
  if (observer) {
    observer.disconnect();
  }
  zeroing();
  refs.btnDelletResult.style.display = 'none';

  refs.formInput.children.namedItem('searchQuery').value = '';

  Notiflix.Notify.success('result deleted.');
}

function onSubmit(evt) {
  evt.preventDefault();
  refs.menuStory.classList.add('visually-hidden');
  refs.body.classList.remove('noScroll');
  refs.modalCont.classList.add('visually-hidden');
  if (observer) {
    observer.disconnect();
  }
  zeroing();
  importElm();
  refs.btnDelletResult.style.display = 'block';
}

export function zeroing() {
  refs.gallery.innerHTML = '';
  page = 1;
}

function importElm() {
  const language = refs.formInput[3].value;
  const textSearchs = refs.formInput[0].value;

  fetchApi(textSearchs, page, language)
    .then(result => {
      if (result.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        throw new Error(response.status);
      }
      creatE(result, textSearchs);
    })
    .catch(err => {
      console.log(err);
    });
}

function setLocalStory(textSearchs) {
  if (!auditSetItemLocal(textSearchs)) {
    localStorage.setItem(`numberStory`, numberStory);
    localStorage.setItem(`story${numberStory}`, textSearchs);
    if (numberStory >= 10) {
      numberStory = 0;
    }
    numberStory += 1;
  }
}

function auditSetItemLocal(textSearchs) {
  let truFal = false;
  for (let i = 0; i < 10; i++) {
    if (localStorage.getItem(`story${i}`) === textSearchs) {
      return true;
    }
  }
  return truFal;
}

function creatE(objImages, textSearchs) {
  setLocalStory(textSearchs);
  console.log(textSearchs);
  if (objImages.hits[0] === undefined) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    if (observer) {
      observer.disconnect();
    }

    return;
  }

  if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${objImages.totalHits} images.`);
    creatElmHtml(objImages);
    return;
  }
  creatElmHtml(objImages);
}

function addElmHtml(arr, objImages) {
  refs.gallery.insertAdjacentHTML('beforeend', arr);
  lightbox();
  page += 1;

  if (objImages.totalHits > 40) {
    observer.observe(refs.guard);
  }
}

function lightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    overlayOpacity: 0.7,
  });
}
function creatElmHtml(objImages) {
  const arrObjElm = objImages.hits;

  const markup = [];

  arrObjElm.map(element =>
    markup.push(
      `<a class="gallery__item" onclick="event.preventDefault()"
     href="${element.largeImageURL}">
     <div class="photo-card">
      <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy"/>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
      ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
      ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
    ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
    ${element.downloads}
        </p>
      </div>
    </div>
    </a>`
    )
  );

  addElmHtml(markup.join(' '), objImages);
}
