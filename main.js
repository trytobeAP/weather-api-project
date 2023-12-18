import { addCityFavorite, CITIES_FAVORITE, deleteCityFavorite } from "./functions.js";

const apiKey = 'c2823683bdc913fdce53eb7f3ba6682c';
const weatherForm = document.querySelector('.weather__form');

let cityName;
let imgAddFavoriteChecker = false;

function REQUEST(cityName) {
  document.querySelector('.img_visual-left__add-favor').classList.remove("favoriteOn");
  imgAddFavoriteChecker = false;

  cityName = cityName[0].toUpperCase() + cityName.slice(1, cityName.length);
  if (CITIES_FAVORITE.includes(cityName)) {
    imgAddFavoriteChecker = true;
    console.log(`imgAddFavoriteChecker = true`);//
    imgAddFavorite.classList.add("favoriteOn");
  }
  const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      console.log(`response.status - ${response.status}`);
      if (response.status === 404) {
        document.querySelector('.weather__input').value = '';
        imgAddFavoriteChecker = false;
        imgAddFavorite.classList.remove("favoriteOn");
        console.log(`imgAddFavoriteChecker = false`);

        throw new Error('404 полетело');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); //
      let tempNowHTML = document.querySelector('.visual-left__temp');
      let tempNow = data.main.temp;
      tempNowHTML.textContent = Math.floor(tempNow);

      let iconNowHtml = document.querySelector('.img_visual-left__icon');
      let iconNow = data.weather[0].icon;
      console.log(iconNow); //
      iconNowHtml.setAttribute('src', `https://openweathermap.org/img/wn/${iconNow}@4x.png`);

      let cityNameHTML = document.querySelector('.visual-left__city');
      cityNameHTML.textContent = cityName;
    })
}

let CityNameStartPage = 'Vologda';
REQUEST(CityNameStartPage);
render();

weatherForm.addEventListener('submit', function(event) {
  event.preventDefault();
  cityName = document.querySelector('.weather__input').value;
  // cityName = document.querySelector('.visual-left__city').value;
  cityName = cityName[0].toUpperCase() + cityName.slice(1, cityName.length);
  REQUEST(cityName);
})

let imgAddFavorite = document.querySelector('.img_visual-left__add-favor');

let cities__added_cityNamesList = document.querySelector('.cities__added-cityNames');

imgAddFavorite.addEventListener('click', function(event) {
  imgAddFavoriteChecker = true;
  console.log(`imgAddFavoriteChecker = true`);//
  removeChildren();
  if (imgAddFavoriteChecker == true) {
    imgAddFavorite.classList.add("favoriteOn");
    addCityFavorite(cityName);
  }

  render();
  console.log(CITIES_FAVORITE);
})

function render() {
  CITIES_FAVORITE.forEach(addedCity => {
    imgAddFavoriteChecker = true;
    console.log(`imgAddFavoriteChecker = true`);//
    imgAddFavorite.classList.add("favoriteOn");

    const newDiv = document.createElement('div');
    newDiv.setAttribute('position', 'absolute');
    const newCloseIcon = document.createElement('img');
    const newDivCityName = document.createElement('div');
    newCloseIcon.setAttribute('src', 'img/close-icon.svg');
    newCloseIcon.className = 'form-summary__img-2';
    newDiv.setAttribute('id', 'id_newDiv');
    newDiv.className = 'cities__added-cityNames__item';
    newDivCityName.textContent = addedCity;

    newDiv.appendChild(newDivCityName);
    newDiv.appendChild(newCloseIcon);
    newDivCityName.classList.add('.favoriteCityElemStyle')

    cities__added_cityNamesList.appendChild(newDiv);


    newCloseIcon.addEventListener('click', function() {
      newDiv.remove();
      document.querySelector('.weather__input').value = '';
      deleteCityFavorite(addedCity);
      console.log(CITIES_FAVORITE);

      // if (addedCity == document.querySelector('.visual-left__city').textContent) {
      if (addedCity == newDivCityName.textContent) {
        console.log("ЗАШЕЛ");
        document.querySelector('.img_visual-left__add-favor').classList.remove("favoriteOn");
        imgAddFavoriteChecker = false;
      }

    })

    newDiv.addEventListener('click', function(event) {
      REQUEST(newDivCityName.textContent);
      imgAddFavoriteChecker = true;
      console.log(`imgAddFavoriteChecker = true`);//
      imgAddFavorite.classList.add("favoriteOn");
    });

  });
}


function removeChildren() {
  while(document.querySelector('#id_newDiv')) {
    document.querySelector('#id_newDiv').remove();
  }
}