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
let time = now.toLocaleTimeString();
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

function showCurrentDay() {
  let element = document.querySelector("#current-date");
  element.innerHTML = `${weekday} ${time}`;
}

function getWeatherData(event) {
  event.preventDefault();
  let newCityName = document.querySelector("#city-name");
  let cityName = document.querySelector("#current-city");
  cityName.innerHTML = newCityName.value;
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCityName.value}&appid=${apiKey}&units=${units}`;
  axios(apiUrl).then(showWeather);
  // apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${newCityName.value}&appid=${apiKey}&units=${units}`;
  // axios.get(apiUrl).then(displayForecast);
  // console.log("this is the getweatherdata function");
}

// Display weather on the page after pressing the Search button
function showWeather(response) {
  currentTemperatureInCelsius = response.data.main.temp;
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.floor(currentTemperatureInCelsius) + "C";
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

// Convert temperatures from Celcius to Fahrenheit and vice versa
function temperatureConverter() {
  if (switchMetricButton.innerHTML === "F") {
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML =
      Math.floor(currentTemperatureInCelsius * 1.8 + 32) + "F";
    switchMetricButton.innerHTML = "C";
  } else {
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = Math.floor(currentTemperatureInCelsius) + "C";
    switchMetricButton.innerHTML = "F";
  }
}

// Function that does an API call for current coordinates
function showPosition(position) {
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

// Get current position and send the position coords to getWeatherData.
function getCurrentPosition(event) {
  event.preventDefault();
  console.log(navigator.geolocation);
  navigator.geolocation.getCurrentPosition((position) => {
    showPosition(position);
  });
}
navigator.geolocation.getCurrentPosition(showPosition);

showCurrentDay();

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", getCurrentPosition);

button.addEventListener("submit", getWeatherData);
switchMetricButton.addEventListener("click", temperatureConverter);
