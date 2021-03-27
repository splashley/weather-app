let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekday = days[now.getDay()];
let icon = document.getElementById("weather-icon");
const weatherIcons = {
  "clear sky": "☀️",
  "few clouds": "🌥️",
  "scattered clouds": "🌥️",
  "broken clouds": "🌥️",
  "shower rain": "🌧️",
  "overcast clouds": "☁️",
  rain: "🌧️",
  thunderstorm: "🌩️",
  snow: "🌨️",
  mist: "🌨️",
};
let button = document.querySelector("#search-form");
let switchMetricButton = document.querySelector("#metric-switch");
let currentTemperatureInCelsius = "";
let currentButton = document.querySelector("#current-button");

// Show current day/time
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function showCurrentTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.querySelector(
    "#current-time"
  ).innerHTML = `${weekday} ${h}:${m}:${s}`;
  t = setTimeout(function () {
    showCurrentTime();
  }, 500);
}

// Get current position and send the position coords to showPosition.
function getCurrentPosition(event) {
  event.preventDefault();
  console.log(navigator.geolocation);
  navigator.geolocation.getCurrentPosition((position) => {
    showPosition(position);
  });
}

// Function that does an API call for current coordinates
function showPosition(position) {
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then((response) => {
    showWeather(response);
    getForecast(response.data.name);
  });
}

// Display weather on the page after pressing the Search button
function showWeather(response) {
  currentTemperatureInCelsius = response.data.main.temp;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.floor(currentTemperatureInCelsius) + "º" + "C";
  let currentClouds = document.querySelector("#current-clouds");
  currentClouds.innerHTML = `Clouds: ${response.data.clouds.all}%`;
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  let currentDesc = document.querySelector("#current-description");
  currentDesc.innerHTML = `${response.data.weather[0].description}`;
  let currentCityName = document.querySelector("#current-city");
  currentCityName.innerHTML = `${response.data.name}`;

  for (const [key, value] of Object.entries(weatherIcons)) {
    if (response.data.weather[0].description === key) {
      icon.innerHTML = value;
    }
  }
}

function getForecast(cityName) {
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  for (let i = 0; i < 5; i++) {
    forecast = response.data.list[i];
    forecastElement.innerHTML += `<div class="col-sm">
                  <strong> <span class="max-temp">${Math.floor(
                    forecast.main.temp_max
                  )}</span>º |</strong>
                  <span class="min-temp">${Math.floor(
                    forecast.main.temp_min
                  )}</span>º
            </div>`;
  }
}

// API call to get Weather Data
function getWeatherData(event) {
  event.preventDefault();
  let newCityName = document.querySelector("#city-name");
  let cityName = document.querySelector("#current-city");
  cityName.innerHTML = newCityName.value;
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCityName.value}&appid=${apiKey}&units=${units}`;
  axios(apiUrl).then(showWeather);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${newCityName.value}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
  console.log("this is the getweatherdata function");
}

// Convert temperatures from Celcius to Fahrenheit and vice versa
function temperatureConverter() {
  if (switchMetricButton.innerHTML === "F") {
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML =
      Math.floor(currentTemperatureInCelsius * 1.8 + 32) + "º" + "F";
    switchMetricButton.innerHTML = "C";
  } else {
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = Math.floor(currentTemperatureInCelsius) + "º" + "C";
    switchMetricButton.innerHTML = "F";
  }
}

showCurrentTime();
navigator.geolocation.getCurrentPosition(showPosition);
currentButton.addEventListener("click", getCurrentPosition);
button.addEventListener("submit", getWeatherData);
switchMetricButton.addEventListener("click", temperatureConverter);
