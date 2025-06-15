const apiKey="68d3b230c6ed39c0239c1b464716fbef";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


const searchBox=document.querySelector(".search input");
const searchBtn=document.querySelector(".search button");
const weatherIcon=document.querySelector(".weather-icon");
const historyToggle = document.querySelector(".history-toggle");
const historyPanel = document.getElementById("historyPanel");

// Store searched city in localStorage
function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  // Avoid duplicates
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    updateHistoryList();
  }
}

// Update the HTML list
function updateHistoryList() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  history.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.style.cursor = "pointer";
    li.onclick = () => checkWeather(city);
    historyList.appendChild(li);
  });
}



async function checkWeather(city) {
    const response=await fetch(apiUrl+ city+ `&appid=${apiKey}`);
    if (response.status==404) {
        document.querySelector(".error").style.display="block";
        document.querySelector(".weather").style.display="none";
    }
    else{
         var data=await response.json();
    // console.log(data);
    document.querySelector(".city").innerHTML=data.name;
    document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+" °C";
    document.querySelector(".humidity").innerHTML=data.main.humidity+" %";
    document.querySelector(".wind").innerHTML=data.wind.speed+" km/h";
saveToHistory(data.name);
    if (data.weather[0].main=="Clouds") {
        weatherIcon.src="images/clouds.png";
    }
    else if (data.weather[0].main=="Clear") {
        weatherIcon.src="images/clear.png";
    }
    else if (data.weather[0].main=="Rain") {
        weatherIcon.src="images/rain.png";
    }
    else if (data.weather[0].main=="Drizzle") {
        weatherIcon.src="images/drizzle.png";
    }
    else if (data.weather[0].main=="Mist") {
        weatherIcon.src="images/mist.png";
    }

    document.querySelector(".weather").style.display="block";
    document.querySelector(".error").style.display="none";

    }
   
}
searchBtn.addEventListener("click",()=>{

    checkWeather(searchBox.value);
});

searchBox.addEventListener("keyup",(event)=>{
    if (event.key==="Enter") {
        checkWeather(searchBox.value);
    }
});
historyToggle.addEventListener("click", () => {
  historyPanel.classList.toggle("active");

  const openIcon = document.getElementById("openIcon");
  const closeIcon = document.getElementById("closeIcon");

  const isActive = historyPanel.classList.contains("active");

  openIcon.style.display = isActive ? "none" : "inline";
  closeIcon.style.display = isActive ? "inline" : "none";
});

// Clear History Button Functionality
const clearBtn = document.getElementById("clearHistoryBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("weatherHistory");
    updateHistoryList();
  });
}

// Load history on page load
updateHistoryList();
