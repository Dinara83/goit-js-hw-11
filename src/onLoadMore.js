import { fetchApiService, renderGalleryCard, onFetchError } from './index';

export function onLoadMore() {
  fetchApiService.fetchCard().then(renderGalleryCard).catch(onFetchError);
}
