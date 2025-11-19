
async function getWeather() {
    const city = document.getElementById('placeName').value;
    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found! Check spelling.");
            return;
        }
        const data = await response.json(); //

        document.getElementById('temp').innerText = Math.round(data.main.temp) + '°C';
        document.getElementById('percHumidity').innerText = "Humidity: " + data.main.humidity + '%';
        document.getElementById('windSpeed').innerText = "Wind: " + data.wind.speed + " m/s";
        document.getElementById('windDirection').innerText = "Direction: " + data.wind.deg + "°";
        document.getElementById('cloudCover').innerText = "Cover: " + data.clouds.all + "%";

        const rainAmount = data.rain ? data.rain["1h"] : 0;
        document.getElementById('percRain').innerText = "Rain: " + rainAmount + " mm";

        document.getElementById('Sunrise').innerText = "Sunrise: " + new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        document.getElementById('Sunset').innerText = "Sunset: " + new Date(data.sys.sunset * 1000).toLocaleTimeString();

        document.getElementById('placeName').innerText = data.name;

        const offset = data.timezone / 3600;
        const sign = offset >= 0 ? "+" : "";
        document.getElementById('timeZone').innerText = "Timezone: UTC " + sign + offset;

        document.getElementById('feelsLike').innerText = "Feels like: " + Math.round(data.main.feels_like) + '°C';

        console.log(data);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

