/**
 * @typedef {Object} WeatherData
 * @property {string} name
 * @property {Object} main
 * @property {number} main.temp
 * @property {number} main.humidity
 * @property {number} main.feels_like
 * @property {Object} wind
 * @property {number} wind.speed
 * @property {number} wind.deg
 * @property {Array} weather
 * @property {string} weather.0.description
 * @property {string} weather.0.icon
 * @property {Object} sys
 * @property {number} sys.sunrise
 * @property {number} sys.sunset
 * @property {number} timezone
 */

// 1. EVENT LISTENERS
// Listen for the Enter key
document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// 2. THE MAIN FUNCTION
// We allow an optional parameter 'defaultCity' for the startup
async function getWeather(defaultCity) {

    // LOGIC: Use defaultCity if provided, otherwise check the input box
    const city = defaultCity || document.getElementById('searchBar').value;

    if (!city) return; // Stop if empty

    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found!");
            return;
        }

        /** @type {WeatherData} */
        const data = await response.json();

        // --- INJECTING DATA (No appendChild needed!) ---

        // 1. City Name
        document.getElementById('placeName').innerText = data.name;

        // 2. Temperature & Feels Like
        document.getElementById('tempBox').innerText = Math.round(data.main.temp);
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);

        // 3. Description (e.g. "scattered clouds")
        document.getElementById('conditionText').innerText = data.weather[0].description;

        // 4. Humidity
        document.getElementById('humidityBox').innerText = data.main.humidity;

        // 5. Wind Speed
        document.getElementById('windBox').innerText = data.wind.speed;

        // 6. Time (Local)
        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // 7. Sunrise
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('sunBox').innerText = sunriseTime;

        // 8. Dynamic Icon (Using innerHTML to swap the image tag)
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="w-32 h-32 mx-auto drop-shadow-lg">`;

        console.log("Weather updated for:", data.name);

    } catch (error) {
        console.error("Error:", error);
    }
}

// 3. STARTUP
// Run this immediately so the screen isn't empty when the user arrives
getWeather("Genk");