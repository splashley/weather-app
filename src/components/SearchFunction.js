import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrentTime from "./CurrentTime";

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

export default function SearchFunction() {
  const [icon, setIcon] = useState("");
  const [currentTemperature, setCurrentTemperature] = useState("");
  const [weatherUnit, setWeatherUnit] = useState("F");

  const currentForecastMaxTemp = [];

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
    let apiKey = "8d1546f5bc580e0e5af594d9883d4a88";
    let units = "metric";
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then((response) => {
      showWeather(response);
      getForecast(response.data.name);
    });
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
  }

  // Display weather on the page after pressing the Search button
  function showWeather(response) {
    console.log(response.data.main.temp);
    setCurrentTemperature(Math.floor(response.data.main.temp));
    let currentTemp = document.querySelector("#current-temp");
    currentTemp.innerHTML = Math.floor(currentTemperature) + "º" + "C";
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
        setIcon(value);
      }
    }
  }

  function getForecast(cityName) {
    let apiKey = "8d1546f5bc580e0e5af594d9883d4a88";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayForecast);
  }

  function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = null;
    let forecast = null;
    for (let i = 0; i < 5; i++) {
      forecast = response.data.list[i];
      currentForecastMaxTemp.push(forecast.main.temp_max);
      forecastElement.innerHTML += `<div class="col-sm">
                  <strong> <span class="max-temp">${Math.floor(
                    forecast.main.temp_max
                  )}</span><span class="measurement-symbol">ºC</span> |</strong>
                  <span class="min-temp">${Math.floor(
                    forecast.main.temp_min
                  )}</span><span class="measurement-symbol">ºC</span>
            </div>`;
    }
  }

  // Convert temperatures from Celcius to Fahrenheit and vice versa
  function temperatureConverter(event) {
    if (event.target.outerText === "F") {
      console.log(currentTemperature + "this is the if");
      setCurrentTemperature(
        Math.floor(parseFloat(currentTemperature) * 1.8 + 32)
      );
      setWeatherUnit("C");
      console.log(currentTemperature + "if - after the math");
    } else {
      console.log(currentTemperature + "this is the else");
      setCurrentTemperature(
        Math.floor(parseFloat(currentTemperature - 32) / 1.8)
      );
      setWeatherUnit("F");
      console.log(currentTemperature + "else - after the math");
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition);
  }, []);

  return (
    <div>
      <div className="row px-4 py-1">
        <div className="col">
          <form id="search-form" className="form-inline">
            <input
              type="text"
              className="p-1"
              id="city-name"
              placeholder="Enter a city name"
            />
            <button
              id="city-name-search"
              className="btn btn-outline-light m-4"
              onClick={getWeatherData}
            >
              Search
            </button>
            <button
              className="btn btn-outline-light"
              id="current-button"
              onClick={getCurrentPosition}
            >
              Current
            </button>
          </form>
        </div>
      </div>
      <div className="row p-4">
        <div className="col-sm">
          <h1 id="current-city"></h1>
          <CurrentTime />
          <h4 id="current-description"></h4>
        </div>
        <div className="col-sm">
          <h5 id="current-clouds">Clouds:</h5>
          <h5 id="current-wind">Wind:</h5>
        </div>
      </div>
      <div className="row px-4 py-1">
        <div className="col-sm d-inline-flex">
          <span id="weather-icon">{icon}</span>
          <h1 id="current-temp">{currentTemperature}</h1>
          <button
            id="metric-switch"
            className="btn btn-light mx-3"
            onClick={temperatureConverter}
          >
            {weatherUnit}
          </button>
        </div>
      </div>
      <div className="row p-4" id="forecast"></div>
      <div id="bottom-link">
        View Project on{" "}
        <a href="https://github.com/splashley/weather-app">Github</a>
      </div>
    </div>
  );
}
