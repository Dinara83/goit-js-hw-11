import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchApiService from './js/fetch-api';
import { refs } from './js/refsHits';
import { galleryCard } from './js/galleryCard.js';
import LoadMoreBtn from './js/components/load-more-btn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
console.log(loadMoreBtn);

const fetchApiService = new FetchApiService();

refs.searchForm.addEventListener('submit', searchForm);
loadMoreBtn.refs.button.addEventListener('click', fetchCardBtn);
// const simpleLightBox = new SimpleLightbox('.gallery a').refresh();

// const gallery = new SimpleLightbox('.gallery a', {
//   captionDelay: 250,
//   overlayOpacity: 0.8,
//   closeText: 'x',
//   scrollZoom: false,
// });
// gallery.refresh();

async function searchForm(element) {
  try {
    element.preventDefault();

    fetchApiService.query =
      element.currentTarget.elements.searchQuery.value.trim();

    if (fetchApiService.query === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    loadMoreBtn.show();
    fetchApiService.resetPage();
    clearGalleryCard();

    fetchCardBtn();
  } catch (error) {
    console.log(error);
  }
}

function fetchCardBtn() {
  loadMoreBtn.disable();
  fetchApiService.fetchCard().then(hits => {
    renderGalleryCard(hits);
    loadMoreBtn.enable();
  });
}

function renderGalleryCard(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
  //   const markup = hits.map(galleryCard).join('');
  //   return refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}
