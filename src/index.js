import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import Notiflix from "notiflix";

document.addEventListener('DOMContentLoaded', function () {
  const breedSelect = document.querySelector('.breed-select');
  const loader = document.querySelector('.loader');
  const catInfo = document.querySelector('.cat-info');

  function toggleLoader(showLoader) {
    if (showLoader) {
      loader.classList.remove('hidden');
    } else {
      loader.classList.add('hidden');
    }
  }

  function toggleError(showError) {
  const errorParagraph = document.querySelector('.error');

  if (showError) {
    Notiflix.Notify.error('Error', 'Oops! Something went wrong! Try reloading the page!', 'Reload');
    errorParagraph.classList.remove('hidden');
  } else {
    errorParagraph.classList.add('hidden');
  }
}

  function populateBreedsSelect(breeds) {
    breedSelect.innerHTML = '';
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

     breedSelect.style.display = 'block';
  }

  function handleBreedSelection() {
    const selectedBreedId = breedSelect.value;
    if (selectedBreedId) {
      fetchCatInfo(selectedBreedId);
    }
  }

  function displayCatInfo(cat) {
    catInfo.innerHTML = `
      <img src="${cat[0].url}" alt="Cat Image">
      <h2>${cat[0].breeds[0].name}</h2>
      <p>${cat[0].breeds[0].description}</p>
      <p>Temperament: ${cat[0].breeds[0].temperament}</p>
    `;
  }

  function handleCatInfoError(error) {
  Notiflix.Report.failure('Error', `Error loading cat information: ${error.message}`, 'Close');
}

  function fetchCatInfo(breedId) {
    toggleLoader(true);
    catInfo.innerHTML = '';
    toggleError(false);

    fetchCatByBreed(breedId)
      .then(displayCatInfo)
      .catch(handleCatInfoError)
      .finally(() => {
        toggleLoader(false);
      });
  }

  toggleLoader(true);
   fetchBreeds()
    .then((breeds) => {
      populateBreedsSelect(breeds);
    })
    .catch(() => {
      toggleError(true);
    })
    .finally(() => {
      toggleLoader(false);
    });

  breedSelect.addEventListener('change', handleBreedSelection);
});