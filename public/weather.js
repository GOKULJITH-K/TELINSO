const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-data-flex");
const weatherCardsDiv = document.querySelector(".fiveday-forecast");

const API_KEY = "3196e87ced6493f50ad86fbd81b7ef3e"; // API key for OpenWeatherMap API


const createWeatherCard = (cityName, weatherItem, index) => {

    
    if(index === 0) { // HTML for the main weather card
        const now = new Date();
  
        // Extract date, time, and day
        const months = now.toLocaleDateString(undefined, { month: 'long', });
        const time = now.toLocaleTimeString();
        const dateNumber = now.getDate();
        const day = now.toLocaleDateString(undefined, { weekday: 'long' });
      


        return `<div class="current-data">
        <p>${cityName} </p>
        <p>${dateNumber} ${months}</p>
        <p>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Wind: ${weatherItem.wind.speed} M/S</p>
        <p>Humidity: ${weatherItem.main.humidity}%</p>
        </div> 
        <div class="current-data">
          <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
          <p style="text-align:center;" >${weatherItem.weather[0].description}</p>
        </div>
    
          `
    } else { // HTML for the other five day forecast card
       
        const now = new Date();
        now.setDate(now.getDate() + index);
        const months = now.toLocaleDateString(undefined, { month: 'long', });
        const time = now.toLocaleTimeString();
        const dateNumber = now.getDate();
        const day = now.toLocaleDateString(undefined, { weekday: 'long' });
    
        return `
        
        <div class="product-col" >
            <div class="forecast-data-flex">
                <div class="forecast-data">
                        
                <p>${dateNumber} ${months}</p>
                <p>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
                <p>Wind: ${weatherItem.wind.speed} M/S</p>
                <p>Humidity: ${weatherItem.main.humidity}%</p>
                </div> 
                <div class="forecast-data">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <p style="text-align:center;">${weatherItem.weather[0].description}</p>
                </div>
            </div>
        </div>`;
    }
}


const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM

        // for( i=0; i<fiveDaysForecast.length;i++){}
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });       
               
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());