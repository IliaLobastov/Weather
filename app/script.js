const API_KEY = 'e3b636c90db6096e0454ebf5bdebf7e5';
document.querySelectorAll('.filter-option').forEach((option) => {
  option.addEventListener('click', function () {
    const checkbox = this.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
  });
});

async function getCoordinates(cityName, limit = 5) {
  try {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Полученные данные:', data);
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].name,
      country: data[0].country,
    };
  } catch (error) {
    console.log('Ошибка:', error);
  }
}

async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Http error! ststus:', response.status);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getWeatherByCityName(cityName) {
  try {
    const coordinates = await getCoordinates(cityName);
    console.log('Координаты города', coordinates);
    const weatherData = await getWeatherByCoordinates(coordinates.lat, coordinates.lon);
    console.log('Данные о погоде', weatherData);
    return {
      location: coordinates,
      weather: weatherData,
    };
  } catch (error) {
    console.error(error)
  }
}
// Использование

//написать функцию фетч запроса которая принимает название из инпута в который вводят название города
//затем передать его в апи и получить погодные данные и вызвать их в третьей функции 
