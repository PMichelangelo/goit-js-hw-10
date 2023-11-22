import axios from "axios";

const apiKey = 'live_iaDxtgV2xrBnpCnIAhmpGqwbb8GoakXvMjz0AUBnpJmKkOMhDvGz7ap7M8XPxpNQ';

axios.defaults.headers.common["x-api-key"] = apiKey;

export function fetchBreeds() {
  return axios.get("https://api.thecatapi.com/v1/breeds")
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching breeds:", error);
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      console.error(`Error fetching cat info for breed ${breedId}:`, error);
      throw error;
    });
}