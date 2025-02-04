const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your OpenWeather API key
const baseURL = 'https://api.openweathermap.org/data/2.5/';

document.getElementById('search-btn').addEventListener('click', searchWeather);

async function searchWeather() {
    const location = document.getElementById('location-input').value.trim();
    if (location) {
        const currentWeather = await fetchWeather(location);
        const forecast = await fetchForecast(location);
        displayWeather(currentWeather);
        displayForecast(forecast);
    }
}

async function fetchWeather(location) {
    const url = `${baseURL}weather?q=${location}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) {
            alert('City not found!');
            return null;
        }
        return data;
    } catch (error) {
        alert('Error fetching weather data.');
        console.error(error);
    }
}

async function fetchForecast(location) {
    const url = `${baseURL}forecast?q=${location}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.list.filter((_, index) => index % 8 === 0); // 8 data points per day
    } catch (error) {
        alert('Error fetching forecast data.');
        console.error(error);
    }
}

function displayWeather(data) {
    if (!data) return;

    document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('wind-speed').innerText = data.wind.speed;

    // Optionally, add an icon or change background based on weather
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('current-weather').innerHTML += `<img src="${iconUrl}" alt="weather icon" />`;
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecast-items');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecast.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h3>${dayName}</h3>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon" />
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}
