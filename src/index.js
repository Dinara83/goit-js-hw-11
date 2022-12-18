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

const fetchApiService = new FetchApiService();

refs.searchForm.addEventListener('submit', searchForm);
loadMoreBtn.refs.button.addEventListener('click', fetchCards);

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  overlayOpacity: 0.8,
  closeText: 'x',
  scrollZoom: false,
});

function searchForm(element) {
  element.preventDefault();
  clearGalleryCard();
  fetchApiService.query =
    element.currentTarget.elements.searchQuery.value.trim();
  fetchApiService.resetPage();

  loadMoreBtn.disable();
  fetchCards();
  if (fetchApiService.query === '') {
    Notiflix.Notify.failure(
      `The search string cannot be empty. Please specify your search query.`
    );
  }
}

async function fetchCards() {
  loadMoreBtn.disable();
  fetchApiService.incrementPage();
  await fetchApiService.fetchCards().then(data => {
    if (!data.totalHits) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      renderGalleryCard(data);
      simpleLightBox.refresh();
    }

    if (data.totalHits > data.total) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      loadMoreBtn.hide();
    }
  });

  loadMoreBtn.enable();
}

function renderGalleryCard(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
  clearGalleryCard();
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}
