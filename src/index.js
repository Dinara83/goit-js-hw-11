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
loadMoreBtn.refs.button.addEventListener('click', fetchCardsQuery);

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  overlayOpacity: 0.8,
  closeText: 'x',
  scrollZoom: false,
});

async function searchForm(element) {
  element.preventDefault();
  clearGalleryCard();
  fetchApiService.query =
    element.currentTarget.elements.searchQuery.value.trim();
  fetchApiService.resetPage();
  //   Notiflix.Loading.standard('Loading...');
  loadMoreBtn.disable();

  if (fetchApiService.query === '') {
    Notiflix.Notify.failure(
      `The search string cannot be empty. Please specify your search query.`
    );
    return;
  }
  await fetchCardsQuery();
}

async function fetchCardsQuery() {
  // Notiflix.Loading.standard('Loading...');
  loadMoreBtn.disable();
  try {
    const data = await fetchApiService.fetchCards();

    if (!data.totalHits) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else {
      renderGalleryCard(data.hits);
      simpleLightBox.refresh();
      fetchApiService.incrementPage();
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    // if (totalHits > per_page) {
    //   Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    //   renderGalleryCard();
    //   renderGalleryCard();
    //   simpleLightBox.refresh();
    // }

    if (data.totalHits === 0) {
      Notiflix.Notify.success(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMoreBtn.hide();
    }
  } catch (error) {
    Notiflix.Notify.info(
      `Sorry, there are no images matching your search ${fetchApiService.query}. Please try again.`
    );
  }
}

function renderGalleryCard(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}
