const API_KEY = 'e3b636c90db6096e0454ebf5bdebf7e5';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('city-search-input');
const cityContainer = document.getElementById('city-card-container');

// маппинг иконок
const weatherIcons = {
  Clear: 'icons/clear.png',
  Clouds: 'icons/cloudy.png',
  Rain: 'icons/rainy.png',
  Drizzle: 'icons/drizzle.png',
  Snow: 'icons/snow.png',
  Thunderstorm: 'icons/storm.png',
  Mist: 'icons/mist.png',
  Fog: 'icons/mist.png',
};

function saveCityToHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  history.forEach((city) => {
    getWeatherByCityName(city);
  });
}

function setBackground(weather) {
  document.body.className = ''; // сброс
  if (weather === 'Clear') document.body.classList.add('bg-sunny');
  else if (weather === 'Clouds') document.body.classList.add('bg-cloudy');
  else if (weather === 'Rain' || weather === 'Drizzle') document.body.classList.add('bg-rainy');
  else if (weather === 'Snow') document.body.classList.add('bg-snowy');
  else if (weather === 'Thunderstorm') document.body.classList.add('bg-stormy');
  else document.body.classList.add('bg-default');
}

async function getCoordinates(cityName) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  if (data.length === 0) throw new Error(`Город "${cityName}" не найден`);
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
}

async function getWeatherByCoordinates(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  const data = await response.json();
  return {
    cityName: data.name,
    temp: Math.round(data.main.temp),
    weather: data.weather[0].main,
    wind: data.wind.speed,
    pressure: data.main.pressure,
    humidity: data.main.humidity,
  };
}

async function getWeatherByCityName(cityName) {
  try {
    const coords = await getCoordinates(cityName);
    const weather = await getWeatherByCoordinates(coords.lat, coords.lon);
    addCardCity(weather);
    saveCityToHistory(coords.name);
    setBackground(weather.weather);
  } catch (error) {
    alert(error.message);
  }
}

function addCardCity({ cityName, temp, weather, wind, pressure, humidity }) {
  const iconSrc = weatherIcons[weather] || 'icons/cloudy.png'; // fallback

  const card = document.createElement('div');
  card.classList.add('city-card');
  card.innerHTML = `
    <div class="weather-icon">
      <img src="${iconSrc}" alt="${weather}" />
    </div>
    <div class="city-info">
      <h2 class="city-name">${cityName}</h2>
      <div class="temperature">${temp}°C</div>
    </div>
    <div class="details">
      <p>Wind: ${wind} km/h</p>
      <p>Humidity: ${humidity}%</p>
      <p>Pressure: ${pressure} hPa</p>
      <p class="weather-condition">${weather}</p>
    </div>
  `;
  cityContainer.prepend(card);

  // анимация появления
  requestAnimationFrame(() => card.classList.add('show'));
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityName = searchInput.value.trim();
  if (!cityName) return alert('Введите название города');
  getWeatherByCityName(cityName);
  searchInput.value = '';
});

// загрузка истории при старте
loadHistory();
