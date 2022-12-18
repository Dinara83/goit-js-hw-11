const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const URL_KEY = '31934563-bfdfc3e562fca017f9814bb5d';
const URL = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class FetchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async fetchCard() {
    const response = await axios.get(
      `${BASE_URL}/?key=${URL_KEY}&q=${this.searchQuery}&per_page=${this.per_page}&page=${this.page}&${URL}`
    );
    const data = await response.data;
    console.log(data);
    if (response.status !== 200) {
      throw new Error(response.status);
    }

    this.incrementPage();
    return data;
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
