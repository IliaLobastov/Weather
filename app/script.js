const API_KEY = 'e3b636c90db6096e0454ebf5bdebf7e5';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('city-search-input');
const cityContainer = document.getElementById('city-card-container');

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
  let bg;
  switch (weather) {
    case 'Clear':
      bg = 'linear-gradient(to right, #56ccf2, #2f80ed)';
      break;
    case 'Clouds':
      bg = 'linear-gradient(to right, #757f9a, #d7dde8)';
      break;
    case 'Rain':
    case 'Drizzle':
      bg = 'linear-gradient(to right, #314755, #26a0da)';
      break;
    case 'Snow':
      bg = 'linear-gradient(to right, #83a4d4, #b6fbff)';
      break;
    case 'Thunderstorm':
      bg = 'linear-gradient(to right, #232526, #414345)';
      break;
    case 'Mist':
      bg = 'linear-gradient(to right, #606c88, #3f4c6b)';
      break;
    default:
      bg = '#1b2633';
  }
  document.body.style.background = bg;
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
  const card = document.createElement('div');
  card.classList.add('city-card');
  card.innerHTML = `
    <div class="weather-icon">
      <img src="icons/${weather.toLowerCase()}.png" alt="${weather}" />
    </div>
    <div class="city-header">
      <h2 class="city-name">${cityName}</h2>
      <div class="temperature">${temp}°C</div>
    </div>
    <div class="details">
      <p>Wind: ${wind} km/h</p>
      <p>Humidity: ${humidity}%</p>
      <p>Pressure: ${pressure} hPa</p>
      <p>${weather}</p>
    </div>
  `;
  cityContainer.prepend(card);
  requestAnimationFrame(() => card.classList.add('show'));
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityName = searchInput.value.trim();
  if (!cityName) return alert('Введите название города');
  getWeatherByCityName(cityName);
  searchInput.value = '';
});

// Загружаем историю при старте
loadHistory();
