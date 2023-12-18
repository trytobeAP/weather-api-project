export let CITIES_FAVORITE = [];

export function addCityFavorite(cityName) {
  if (!CITIES_FAVORITE.includes(cityName)) {
    CITIES_FAVORITE.push(cityName);
  }
}

export function deleteCityFavorite(cityName) {
  let indexToDel = citySearchIndex(cityName);
  if (indexToDel != -1) {
    CITIES_FAVORITE.splice(indexToDel, 1);
  } else {
    alert('такой задачи нет!');
  }
}

export function citySearchIndex(cityName) {
  let indexOfCity;
  if (CITIES_FAVORITE[0] == undefined) {
    return -1;
  }
  CITIES_FAVORITE.forEach(() => {
    indexOfCity = CITIES_FAVORITE.findIndex(city => city == cityName);
  });
  console.log(`indexOfTask - ${indexOfCity}`);
  return indexOfCity;
}