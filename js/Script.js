// GLOBAL STATE: Track the current theme
let currentTheme = 'human';

/** * @typedef {Object} WeatherData
 * ... (Your JSDoc is fine, keeping it hidden for brevity) ...
 */

// 1. EVENT LISTENERS
document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather().catch(console.error);
    }
});

// 2. MAIN FUNCTION
async function getWeather(defaultCity) {
    const searchInput = document.getElementById('searchBar');
    const city = defaultCity || searchInput.value;

    if (!city) return;

    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found!");
            return;
        }

        const data = await response.json();

        // --- INJECT STANDARD DATA ---
        document.getElementById('placeName').innerText = data.name;
        document.getElementById('tempBox').innerText = Math.round(data.main.temp);
        document.getElementById('feelsLike').innerText = Math.round(data.main.feels_like);
        document.getElementById('humidityBox').innerText = data.main.humidity;
        document.getElementById('windBox').innerText = data.wind.speed;

        // Description
        const desc = data.weather[0].description;
        document.getElementById('conditionText').innerText = desc.charAt(0).toUpperCase() + desc.slice(1);

        // Time Strings
        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Calculate Standard Times
        const standardSunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const standardSunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // --- THEME LOGIC FOR TEXT (The Fix) ---
        // We set the default text first
        let sunriseBox = standardSunrise;
        let sunsetBox = standardSunset;

        // Then we override it if the theme matches
        if (currentTheme === 'vampire') {
            sunriseBox = 'Time to Coffin ⚰️';
            sunsetBox = 'Feast Time 🩸';
        }
        else if (currentTheme === 'human') {
            // Keep standard time, or add quote
            sunriseBox = 'standardSunrise';
            sunsetBox = 'Put away the garlic!';
        }
        else if (currentTheme === 'gloom') {
            sunriseBox = 'Grow Garlic 🌱';
        }

        // Apply the final text to the HTML boxes
        document.getElementById('sunriseBox').innerText = sunriseText;
        document.getElementById('sunsetBox').innerText = sunsetText;


        // Dynamic Icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="w-40 h-40 mx-auto drop-shadow-lg">`;

        if (!defaultCity) {
            searchInput.value = "";
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

// 3. THEME SYSTEM
const themes = {
    vampire: {
        imagePath: "images/redMoon.jpg",
        targetId: "cardSunset", // Highlights Sunset card
        accent: "border-red-500 bg-red-900/40"
    },
    human: {
        imagePath: "images/clear.jpg",
        targetId: "cardSunrise", // Highlights Sunrise card
        accent: "border-yellow-400 bg-yellow-500/30"
    },
    gloom: {
        imagePath: "images/cloud.jpg",
        targetId: "cardWind", // Highlights Wind card
        accent: "border-purple-400 bg-purple-500/20"
    }
};

function setTheme(themeName) {
    // 1. Update the Global Variable
    currentTheme = themeName;

    const t = themes[themeName];
    if (!t) return;

    // 2. Change Background
    document.body.style.backgroundImage = `url('${t.imagePath}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    // 3. Reset all cards (Remove old borders)
    // Note: You need to add these IDs (cardWind, cardSunrise, cardSunset) to your HTML divs!
    ['cardWind', 'cardSunrise', 'cardSunset'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.className = "glass rounded-[2rem] p-6 flex flex-col justify-center gap-6 flex-1 hover:bg-white/5 transition border border-white/5 relative overflow-hidden";
        }
    });

    // 4. Highlight active card
    const activeCard = document.getElementById(t.targetId);
    if (activeCard) {
        // Add the accent classes
        activeCard.classList.remove('border-white/5'); // Remove default border
        const classes = t.accent.split(' ');
        activeCard.classList.add(...classes);
    }

    // 5. RE-RUN WEATHER to update the text immediately
    // We grab the city that is currently on screen
    const currentCity = document.getElementById('placeName').innerText;
    if(currentCity !== "---") {
        getWeather(currentCity);
    }
}

// Start in Human mode
setTheme('human');

// Initial Load
getWeather("Genk");