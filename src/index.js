import axios from "axios";
import SlimSelect from 'slim-select';

// Встановлення заголовка для API-ключа
axios.defaults.headers.common['x-api-key'] = 'live_iaDxtgV2xrBnpCnIAhmpGqwbb8GoakXvMjz0AUBnpJmKkOMhDvGz7ap7M8XPxpNQ';

// URL API
const API_URL = 'https://api.thecatapi.com/v1';

// Функція для показу завантажувача
function showLoader(element) {
  element.classList.add('loading');
}

// Функція для приховання завантажувача
function hideLoader(element) {
  element.classList.remove('loading');
}

// Функція для показу помилки
function showError(element) {
  element.classList.add('error');
  setTimeout(() => {
    element.classList.remove('error');
  }, 3000); // Приховати через 3 секунди
}

// Функція для отримання інформації про кота за породою
function fetchCatByBreed(breedId) {
  return axios.get(`${API_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching cat information:', error.message);
      throw error;
    });
}

// Функція для отримання списку порід
function fetchBreeds() {
  return axios.get(`${API_URL}/breeds`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching breeds:', error.message);
      throw error;
    });
}

// Функція для заповнення SlimSelect порідами
function populateBreedsSelect(breeds) {
  const selectElement = document.querySelector('.breed-select');
  const loaderElement = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');

  showLoader(loaderElement);

  // Приховати стандартний селект
  selectElement.style.display = 'none';

  loaderElement.style.display = 'none';
  errorElement.style.display = 'none';

  // Створити масив для SlimSelect
  const options = breeds.map(breed => ({ text: breed.name, value: breed.id }));

  // Ініціалізувати SlimSelect
  const slim = new SlimSelect({
    select: selectElement,
    placeholder: 'Select a breed',
    allowDeselect: true,
    data: options,
    onChange: () => {
      const selectedBreedId = slim.selected(); // Отримати обране значення
      showLoader(loaderElement);

      // Запит на отримання інформації про кота за породою
      fetchCatByBreed(selectedBreedId)
        .then(catInfo => {
          displayCatInfo(catInfo);
        })
        .catch(error => {
          console.error('Failed to fetch cat information:', error.message);
          showError(errorElement);
        })
        .finally(() => {
          hideLoader(loaderElement);
        });
    },
  });
}

// Функція для відображення інформації про кота
function displayCatInfo(catInfo) {
  const catInfoElement = document.querySelector('.cat-info');

  catInfoElement.innerHTML = '';

  const imageElement = document.createElement('img');
  imageElement.src = catInfo[0].url;

  const breedNameElement = document.createElement('p');
  breedNameElement.textContent = `Breed: ${catInfo[0].breeds[0].name}`;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = `Description: ${catInfo[0].breeds[0].description}`;

  const temperamentElement = document.createElement('p');
  temperamentElement.textContent = `Temperament: ${catInfo[0].breeds[0].temperament}`;

  catInfoElement.appendChild(imageElement);
  catInfoElement.appendChild(breedNameElement);
  catInfoElement.appendChild(descriptionElement);
  catInfoElement.appendChild(temperamentElement);
}

// Очікування завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
  const loaderElement = document.querySelector('.loader');
  const errorElement = document.querySelector('.error');

  showLoader(loaderElement);

  // Отримання і заповнення SlimSelect списку порід
  fetchBreeds()
    .then(breeds => populateBreedsSelect(breeds))
    .catch(error => {
      console.error('Failed to fetch breeds:', error.message);
      showError(errorElement);
    })
    .finally(() => {
      hideLoader(loaderElement);
    });
});