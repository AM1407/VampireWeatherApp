// GLOBAL STATE: Track the current theme
let currentTheme = 'gardener';

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

        // Inject the TIME (The numbers)
        document.getElementById('sunriseBox').innerText = standardSunrise;
        document.getElementById('sunsetBox').innerText = standardSunset;


        // --- THEME LOGIC ---

        // A. Setup Defaults
        let sunriseTitleText = "Sunrise";
        let sunsetTitleText = "Sunset";
        // Default content for 'Feels Like' is just the number
        let feelsLikeContent = Math.round(data.main.feels_like);

        // B. Check the theme
        if (currentTheme === 'vampire') {
            sunriseTitleText = 'Time to Coffin ⚰️';
            sunsetTitleText = 'Feast Time 🩸';
        }
        else if (currentTheme === 'gardener') {
            sunriseTitleText = 'Start Planting 🧄';
            sunsetTitleText = 'Rest Time 💤';

            // Logic: Calculate Plant Mood based on actual temperature
            // We pass 'data.main.temp' to the helper function
            feelsLikeContent = bepaalPlantenHumeur(data.main.temp);
        }
        else if (currentTheme === 'surfer') {
            sunriseTitleText = 'Catch Rays ☀️';
            sunsetTitleText = 'Stash Board 🏄‍♂️';
        }

        // C. Inject the Custom Text
        document.getElementById('sunriseLabel').innerText = sunriseTitleText;
        document.getElementById('sunsetLabel').innerText = sunsetTitleText;
        document.getElementById('feelsLike').innerText = feelsLikeContent;


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
        targetId: "cardSunset",
        accent: "border-red-500 bg-red-900/40"
    },
    gardener: {
        imagePath: "images/clear.jpg",
        targetId: "cardSunrise",
        accent: "border-green-400 bg-green-500/30"
    },
    surfer: {
        imagePath: "images/fog.jpg",
        targetId: "cardWind",
        accent: "border-blue-400 bg-blue-500/20"
    }
};

function setTheme(themeName) {
    currentTheme = themeName;
    const t = themes[themeName];
    if (!t) return;

    // 1. Background Image
    document.body.style.backgroundImage = `url('${t.imagePath}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

    // 2. Reset Cards
    ['cardWind', 'cardSunrise', 'cardSunset'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            let newClass = "glass rounded-[2rem] p-6 flex flex-col justify-center gap-4 flex-1 hover:bg-white/5 transition border border-white/5 relative overflow-hidden";
            if (id === 'cardWind' || id === 'cardSunrise' || id === 'cardSunset') {
                newClass = "glass rounded-2xl p-4 flex items-center justify-between transition border border-white/5 relative overflow-hidden";
            }
            el.className = newClass;
        }
    });

    // 3. Highlight active card
    const activeCard = document.getElementById(t.targetId);
    if (activeCard) {
        activeCard.classList.remove('border-white/5');
        const classes = t.accent.split(' ');
        activeCard.classList.add(...classes);
    }

    // 4. Refresh text
    const currentCity = document.getElementById('placeName').innerText;
    if(currentCity !== "---") {
        getWeather(currentCity);
    }
}

// 4. HELPER FUNCTIONS (Moved outside!)
function bepaalPlantenHumeur(temp) {
    if (temp < 0) return "Alles is dood. RIP. 💀";
    if (temp < 5) return "Wortels bibberen 🥕";
    if (temp < 15) return "Jas aan. Wied-weer 🧤";
    if (temp < 22) return "Groeizaam! Slakken feest 🐌";
    if (temp < 28) return "Tomaten worden rood! 🍅";
    return "Sla schiet door! Oogsten! 🥵";
}

// Start in Gardener mode
setTheme('gardener');
getWeather("Genk");