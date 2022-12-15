import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchApiService from './js/fetch-api';
import { refs } from './js/refsHits';
import { galleryCard } from './js/galleryCard.js';

refs.searchForm.addEventListener('submit', searchForm);
refs.loadMoreBtn.addEventListener('click', clickLoadMore);

const fetchApiService = new FetchApiService();
const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  overlayOpacity: 0.8,
  closeText: 'x',
  scrollZoom: false,
});

gallery.refresh();

async function searchForm(e) {
  try {
    e.preventDefault();

    fetchApiService.query = e.currentTarget.elements.searchQuery.value.trim();

    if (fetchApiService.query === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    fetchApiService.resetPage();
    await fetchApiService.fetchCard().then(hits => {
      clearGalleryCard();
      renderGalleryCard(hits);
    });
  } catch (error) {
    console.log(error);
  }
  //   .finally(() => form.reset());
}

async function clickLoadMore() {
  try {
    await fetchApiService.fetchCard().then(renderGalleryCard);
  } catch (error) {
    console.log(error);
  }
}

function renderGalleryCard(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}

// function onFetchError(error) {}
