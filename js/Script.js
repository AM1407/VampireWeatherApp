// 1. SETUP: Listen for the "Enter" key on the search bar
document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {

    const inputElement = document.getElementById('searchBar');
    const city = inputElement.value; // Grab what the user typed

    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found!");
            return;
        }
        const data = await response.json();


        document.getElementById('placeName').innerText = data.name;
        document.getElementById('tempBox').innerText = Math.round(data.main.temp);
        document.getElementById('conditionText').innerText = data.weather[0].description;
        document.getElementById('humidityBox').innerText = data.main.humidity;
        document.getElementById('windBox').innerText = data.wind.speed;
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);

        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        document.getElementById('sunBox').innerText = sunriseTime;

        inputElement.value = "";

    } catch (error) {
        console.error("Error:", error);
    }
}