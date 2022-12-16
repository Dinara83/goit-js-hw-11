import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchApiService from './js/fetch-api';
import { refs } from './js/refsHits';
import { galleryCard } from './js/galleryCard.js';

refs.searchForm.addEventListener('submit', searchForm);
refs.loadMoreBtn.addEventListener('click', clickLoadMore);
const simpleLightBox = new SimpleLightbox('.gallery a').refresh();
const fetchApiService = new FetchApiService();
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

    fetchApiService.resetPage();

    const data = await fetchApiService.fetchCard();
    console.log(data);
    clearGalleryCard();
    renderGalleryCard(cards);
  } catch (error) {
    console.log(error);
  }
}

async function clickLoadMore() {
  try {
    fetchApiService.incrementPage();
    await fetchApiService.fetchCard();
    renderGalleryCard(cards);
  } catch (error) {
    console.log(error);
  }
}

function renderGalleryCard(cards) {
  //   refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
  const markup = cards.map(galleryCard).join('');
  return refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}
