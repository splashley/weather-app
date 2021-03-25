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
  rain: "🌧️",
  thunderstorm: "🌩️",
  snow: "🌨️",
  mist: "🌨️",
};

function showCurrentDay() {
  let element = document.querySelector("#current-date");
  element.innerHTML = `${weekday} ${time}`;
}

function getWeatherData(event) {
  event.preventDefault();
  let newCityname = document.querySelector("#city-name");
  let cityName = document.querySelector("#current-city");
  cityName.innerHTML = newCityname.value;
  let apiKey = "b48e954a5eed9632982ee8987daab198";
  let units = "metric";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCityname.value}&appid=${apiKey}&units=${units}`;
  axios(apiURL).then(showWeather);
}

function showWeather(response) {
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = `${response.data.main.temp}C`;
  let currentClouds = document.querySelector("#current-clouds");
  currentClouds.innerHTML = `Clouds: ${response.data.clouds.all}%`;
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  let currentDesc = document.querySelector("#current-description");
  currentDesc.innerHTML = `${response.data.weather[0].description}`;

  Object.keys(weatherIcons).forEach((key) => {
    console.log(response.data.weather[0].description);
    if (response.data.weather[0].description === key) {
      console.log(key, weatherIcons[key], "test", icon);
      icon.innerHTML = weatherIcons[key];
    }
  });
  console.log(response);
}

showCurrentDay();
let button = document.querySelector("#search-form");
button.addEventListener("submit", getWeatherData);
