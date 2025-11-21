// starting theme
let currentTheme = 'gardener';

// Event listener for Enter key in search bar
document.getElementById('searchBar').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather().catch(console.error);
    }
});

// Function to fetch and display weather data
async function getWeather(defaultCity) {
    const searchInput = document.getElementById('searchBar');
    const city = defaultCity || searchInput.value.trim();
    if (!city) return;
// OpenWeatherMap API key and URL
    const apiKey = 'bac320f5ccfe6ea836c14d2c23cb79f7';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
// Fetch weather data
    try {
        const response = await fetch(url);
        if (!response.ok) {
            alert("City not found!");
            return;
        }

        const data = await response.json();


        document.getElementById('placeName').innerText = data.name;
        document.getElementById('tempBox').innerText = Math.round(data.main.temp);

        document.getElementById('humidityBox').innerText = data.main.humidity;
        const windDir = getCompassDirection(data.wind.deg);
        document.getElementById('windBox').innerText = data.wind.speed;
        document.getElementById('windDirection').innerText = windDir;



        const desc = data.weather[0].description;
        document.getElementById('conditionText').innerText = desc.charAt(0).toUpperCase() + desc.slice(1);


        document.getElementById('timeZone').innerText = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});


        const standardSunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const standardSunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});


        document.getElementById('sunriseBox').innerText = standardSunrise;
        document.getElementById('sunsetBox').innerText = standardSunset;


// Theme-specific adjustments
        let sunriseTitleText = "Sunrise";
        let sunsetTitleText = "Sunset";

        let feelsLikeContent = Math.round(data.main.feels_like);


        if (currentTheme === 'vampire') {
            sunriseTitleText = 'Time to Coffin ⚰️';
            sunsetTitleText = 'Feast Time 🩸';
            feelsLikeContent = determineVampireMood(data.main.temp);
        }
        else if (currentTheme === 'gardener') {
            sunriseTitleText = 'Start Planting 🧄';
            sunsetTitleText = 'Take out the Wooden Stakes 🪓';


            feelsLikeContent = determinePlantMood(data.main.temp);
        }
        else if (currentTheme === 'surfer') {
            sunriseTitleText = 'Catch Waves 🌊';
            sunsetTitleText = 'Time to Stash the Board️ 🏄‍♂️';
            feelsLikeContent = determineSurferMood(data.main.temp);
        }


        document.getElementById('sunriseLabel').innerText = sunriseTitleText;
        document.getElementById('sunsetLabel').innerText = sunsetTitleText;
        document.getElementById('feelsLike').innerText = feelsLikeContent;


// Set weather icon
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        document.getElementById('weatherIcon').innerHTML = `<img src="${iconUrl}" alt="Weather Icon" class="w-40 h-40 mx-auto drop-shadow-lg">`;
// Clear search input if default city was used
        if (!defaultCity) {
            searchInput.value = "";
        }
// Log data for debugging
    } catch (error) {
        console.error("Error:", error);
    }
}

// Theme definitions
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
        imagePath: "images/waves2.jpg",
        targetId: "cardWind",
        accent: "border-blue-400 bg-blue-500/20"
    }
};
// Function to set the theme
function setTheme(themeName) {
    currentTheme = themeName;
    const t = themes[themeName];
    if (!t) return;

// Set background image
    document.body.style.backgroundImage = `url('${t.imagePath}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';

// Reset all cards to default classes
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

// Highlight the active card
    const activeCard = document.getElementById(t.targetId);
    if (activeCard) {
        activeCard.classList.remove('border-white/5');
        const classes = t.accent.split(' ');
        activeCard.classList.add(...classes);
    }

// Refresh weather data for current city
    const currentCity = document.getElementById('placeName').innerText;
    if(currentCity !== "---") {
        getWeather(currentCity);
    }
}


// Convert wind degrees to compass direction
function getCompassDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];


    const index = Math.round(degrees / 45) % 8;

    return directions[index];
}

// Gardener mood based on temperature
function determinePlantMood(temp) {
    if (temp < 0) return "Everything is frozen solid. RIP. 💀";
    if (temp < 5) return "My carrot is shrinking 🥕";
    if (temp < 15) return "Put a coat on. Weeding weather 🧤";
    if (temp < 22) return "Good growing weather! Snail party 🐌";
    if (temp < 28) return "Tomatoes are turning red! 🍅";
    return "Lettuce is on fire! Harvest now! 🥵";
}
// Vampire mood based on temperature
function determineVampireMood(temp) {
    if (temp < 0) return "My blood slushie is frozen solid 🍧";
    if (temp < 10) return "Lovely coffin weather. Chill to the bone ⚰️";
    if (temp < 20) return "Perfect night for a bite. Crisp air 🦇";
    if (temp < 30) return "This heavy cape is making me sweat 💦";
    if (temp < 100) return "I am turning to ash! Hiss! 🔥";
    return "Holy water steam bath! ✝️";
}
// Surfer mood based on temperature
function determineSurferMood(temp) {
    if (temp < 0) return "Significant shrinkage warning. 🍤";
    if (temp < 10) return "Wetsuit smells like pee, but at least it's warm. 🚽";
    if (temp < 18) return "Nipples could cut glass right now. 🧊";
    if (temp < 25) return "Speedo time. You're welcome, ladies. 🦅";
    if (temp < 30) return "Sun's out, buns out. Watch the chafing. 🍑";
    return "Sweating like a sinner in church. 🥵";
}

// Initialize with default theme and city
setTheme('gardener');
getWeather("Genk");