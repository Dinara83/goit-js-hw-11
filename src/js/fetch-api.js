const axios = require('axios').default;

const BASE_URL = `https://pixabay.com/api`;
const URL_KEY = `31934563-bfdfc3e562fca017f9814bb5d`;
const URL = `image_type=photo&orientation=horizontal&safesearch=true`;

export default class FetchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchCard() {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/?key=${URL_KEY}&q=${this.formSearchQuery}&per_page=40&page=${this.page}&${URL}`
      );
      this.incrementPage();
      return data;
    } catch {
      throw new Error(response.status);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
