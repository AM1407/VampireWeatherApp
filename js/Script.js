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
 * @property {Object} sys
 * @property {number} sys.sunrise
 * @property {number} sys.sunset
 * @property {number} timezone
 */



document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather().catch(console.error);
    }
});

async function getWeather() {

    const inputElement = document.getElementById('searchBar');
    const city = inputElement.value;

    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found!");
            return;
        }
        const data = await response.json();


        document.getElementById('placeName').innerText = data.name;
        document.getElementById('tempBox').innerText = Math.round(data.main.temp) + "°C";
        document.getElementById('conditionText').innerText = data.weather[0].description;
        document.getElementById('humidityBox').innerText = data.main.humidity + "%";
        document.getElementById('windBox').innerText = data.wind.speed + " m/s";
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like) + "°C";

        document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="w-32 h-32 mx-auto">`;

        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('sunBox').innerText = sunriseTime;

        inputElement.value = "";

    } catch (error) {
        console.error("Error:", error);
    }
}

