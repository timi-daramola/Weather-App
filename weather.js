const apiKey = '5f274f0f3d95c8849cc0b8254d08ea2a'; // API key
const baseURL = 'https://api.openweathermap.org/data/2.5/';

// Check if there is saved weather data in localStorage when the page loads
window.onload = () => {
    const savedLocation = localStorage.getItem('location');
    const savedWeather = JSON.parse(localStorage.getItem('currentWeather'));
    const savedForecast = JSON.parse(localStorage.getItem('forecast'));

    if (savedLocation && savedWeather && savedForecast) {
        // Display last searched location
        document.getElementById('last-searched-location').innerText = `Last Searched Location: ${savedLocation}`;

        // Display weather and forecast for the last searched location
        displayWeather(savedWeather);
        displayForecast(savedForecast);
    }
};

// Add event listener for the search button
document.getElementById('search-btn').addEventListener('click', searchWeather);

async function searchWeather() {
    const location = document.getElementById('location-input').value.trim();
    if (location) {
        const currentWeather = await fetchWeather(location);
        const forecast = await fetchForecast(location);

        if (currentWeather && forecast) {
            // Display weather and forecast
            displayWeather(currentWeather);
            displayForecast(forecast);

            // Save the location and weather data to localStorage
            localStorage.setItem('location', location); // Save location name
            localStorage.setItem('currentWeather', JSON.stringify(currentWeather)); // Save current weather
            localStorage.setItem('forecast', JSON.stringify(forecast)); // Save forecast

            // Render the last searched location in the HTML
            document.getElementById('last-searched-location').innerText = `Last Searched Location: ${location}`;
        }
    }
}

// Fetch current weather data from OpenWeather API
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

// Fetch 5-day forecast data from OpenWeather API
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

// Display current weather information
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

// Display the 5-day weather forecast
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
