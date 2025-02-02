
const userTab=document.querySelector("[data-userWeather]");
const SearchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAcessContainer=document.querySelector(".grant-location-container");
const searchForm =document.querySelector(".form-container");

const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");



let currentTab=userTab;
// const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
const API_KEY="d72e26caea0ba3ecdb8bebd7c05564bc";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab; 
        currentTab.classList.add("current-tab"); 
    }
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAcessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // initianly we were on search tab
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // ab yaha weathe rbhi dusplay karna padega
        // jo ke mere defalut loction ka karega
        //jo storage me maine sAVE kia hoga 
        getfromSessionStorage();

    }

}

userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});
SearchTab.addEventListener("click", ()=>{
    switchTab(SearchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

   async function  fetchUserWeatherInfo(coordinates){
    const {lat,lon } = coordinates;
    //make grantcontainer invisible
    grantAcessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // now do api call
     try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`) ;
     const data= await response.json();
     console.log(data);
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     renderWeatherInfo(data);
    }
     catch(err){
        loadingScreen.classList.remove("active");
        alert("Failed to fetch weather data. Please try again.");

     }
}

function renderWeatherInfo(weatherInfo){
     // fech the elements
     const cityName = document.querySelector("[data-cityName]");

  const countryIcon = document.querySelector("[data-countryIcon]");

  const desc = document.querySelector("[data-weatherDesc]");

  const weatherIcon = document.querySelector("[data-weatherIcon]");

  const temp = document.querySelector("[data-temp]");

  const windspeed = document.querySelector("[data-windspeed]");

  const humidity = document.querySelector("[data-humidity]"); 

  const cloudiness = document.querySelector("[data-cloudiness]");

  // fetch values form werather info obj

  cityName.innerText=weatherInfo?.name;

  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText=weatherInfo?.weather?.[0]?.description;
  weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText= `${weatherInfo?.main?.temp/10}°C`;
  windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText=`${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}
function getlocation(){
  if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(showPosition);
  }  
  else{
    alert("Geolocation is not supported by your browser.");
  }
}
function showPosition(position){
    const userCoordinates ={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
}

const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    console.log(cityName);
    
    if(cityName==""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
loadingScreen.classList.add("active");
userInfoContainer.classList.remove("active");
grantAcessContainer.classList.remove("active");

try{
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&unsits=metric`);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(err){
    
    console.error("Error fetching weather data:", err);
    alert("Failed to fetch weather data. Please check the city name or network connection  and try again.");

}
}