import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchApiService from './js/fetch-api';
import { refs } from './js/refsHits';
import { galleryCard, getGalleryCard } from './js/galleryCard.js';
import LoadMoreBtn from './js/components/load-more-btn';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const fetchApiService = new FetchApiService();

refs.searchForm.addEventListener('submit', searchForm);
loadMoreBtn.refs.button.addEventListener('click', fetchCardBtn);

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  overlayOpacity: 0.8,
  closeText: 'x',
  scrollZoom: false,
});

async function searchForm(element) {
  element.preventDefault();

  fetchApiService.query =
    element.currentTarget.elements.searchQuery.value.trim();
  fetchApiService.resetPage();
  clearGalleryCard();
  loadMoreBtn.disable();
  await fetchCardBtn();
  if (fetchApiService.query === '')
    Notiflix.Notify.failure(
      `The search string cannot be empty. Please specify your search query.`
    );
}

async function fetchCardBtn() {
  loadMoreBtn.disable();
  fetchApiService.incrementPage();
  await fetchApiService
    .fetchCard()
    .then(data => {
      if (!data.totalHits) {
        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
      } else {
        renderGalleryCard(data);
        simpleLightBox.refresh();
      }
    })
    .catch(error => {
      console.log(error);
    });

  loadMoreBtn.enable();
  //   } catch (error) {
  //     Notiflix.Notify.info(`Error`);
  //   }
  //   if (data.totalHits > per_page) {
  //     Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  //     loadMoreBtn.enable();
  //   }
}
function renderGalleryCard(hits) {
  refs.galleryList.insertAdjacentHTML('beforeend', galleryCard(hits));
  clearGalleryCard();
}

function clearGalleryCard() {
  refs.galleryList.innerHTML = '';
}
