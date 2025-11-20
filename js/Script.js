/**
 * @typedef {Object} WeatherData
 * @property {string} name
 * @property {Object} main
 * @property {number} main.temp
 * @property {number} main.humidity
 * @property {number} main.feels_like
 * @property {Object} wind
 * @property {number} wind.speed
 * @property {Array} weather
 * @property {string} weather.0.description
 * @property {string} weather.0.icon
 * @property {Object} sys
 * @property {number} sys.sunrise
 */

// 1. EVENT LISTENERS
document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather().catch(console.error);
    }
});

// 2. MAIN FUNCTION
async function getWeather(defaultCity) {

    // Input Logic: Use default city OR the value in the search bar
    const searchInput = document.getElementById('searchBar');
    const city = defaultCity || searchInput.value;

    if (!city) return;

    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found! Please check spelling.");
            return;
        }

        /** @type {WeatherData} */
        const data = await response.json();

        // --- INJECTING DATA ---

        // 1. Text Data
        document.getElementById('placeName').innerText = data.name;
        document.getElementById('tempBox').innerText = Math.round(data.main.temp);
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);
        document.getElementById('humidityBox').innerText = data.main.humidity;
        document.getElementById('windBox').innerText = data.wind.speed;

        // 2. Description (Capitalized)
        // "scattered clouds" -> "Scattered Clouds" for looks
        const desc = data.weather[0].description;
        document.getElementById('conditionText').innerText = desc.charAt(0).toUpperCase() + desc.slice(1);

        // 3. Time Strings
        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        document.getElementById('sunriseBox').innerText = sunriseTime;
        document.getElementById('sunsetBox').innerText = sunsetTime;

        // 4. Dynamic Icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="w-40 h-40 mx-auto drop-shadow-lg">`;

        // 5. Cleanup (Clear the search bar if it was a manual search)
        if (!defaultCity) {
            searchInput.value = "";
        }

        console.log("Weather updated for:", data.name);

    } catch (error) {
        console.error("Error:", error);
    }
}

// 3. STARTUP CALL
getWeather("Genk");