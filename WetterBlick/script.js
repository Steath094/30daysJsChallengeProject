import { API_KEY ,PVT_TOKEN } from "./config.js"

//setting and selecting div value for current weather
let body = document.querySelector("body")
let temperature = document.querySelector(".temperature");
let humidity = document.querySelector(".humidity");
let windSpeed = document.querySelector(".windspeed");
let weather = document.querySelector('.weather-img');
let location = document.querySelector('.locationvalue');
let cloud = document.querySelector('.cloud');
let feel = document.querySelector('.feelslike');
let pressure = document.querySelector('.pressure');
let visibility = document.querySelector('.visibility');
let winddirection = document.querySelector('.winddirection');
let region = document.querySelector(".regionvalue");
let lastupdate = document.querySelector(".lastupdate");
let time = document.querySelector(".time");
let condition = document.querySelector(".conditionText");
let heatindex = document.querySelector(".heatindex");
let searchbutton = document.querySelector(".get-weather")
let search = document.querySelector("#city");
let today = document.querySelector(".today")
let daily = document.querySelector(".daily")
let todayBtn = document.querySelector("#todayButton")
let dailyBtn = document.querySelector("#dailyButton")


dailyBtn.addEventListener("click",()=>{
    today.style.display="none"
    daily.style.display="flex"

})
todayBtn.addEventListener("click",()=>{
    daily.style.display="none"
    today.style.display="flex"
})

function getCity(coordinates) { 
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest(); 
        var lat = coordinates[0]; 
        var lng = coordinates[1]; 

    
        xhr.open('GET', `https://us1.locationiq.com/v1/reverse.php?key=${PVT_TOKEN}&lat=${lat}&lon=${lng}&format=json`, true); 
        xhr.send(); 

        xhr.onreadystatechange = function() { 
            if (xhr.readyState == 4) { 
                if (xhr.status == 200) { 
                    var response = JSON.parse(xhr.responseText); 
                    var city = response.address.city || response.address.town || response.address.village;
                    resolve(city); 
                } else {
                    reject("Error fetching the city name");
                }
            } 
        }; 
    });
}

function main() {
    navigator.geolocation.getCurrentPosition(success, error, options); 
	var options = { 
		enableHighAccuracy: true, 
		timeout: 5000, 
		maximumAge: 0 
	}; 

	function success(pos) { 
		var crd = pos.coords; 
		var lat = crd.latitude.toString(); 
		var lng = crd.longitude.toString(); 
		var coordinates = [lat, lng]; 
		// console.log(`Latitude: ${lat}, Longitude: ${lng}`); 
		getCity(coordinates)
		.then(city=> {
			// console.log(city);
			
			setValues(city);
            set3daysValue(city,3)
		}
		)
		return; 
	}
	function error(err) { 
		console.warn(`ERROR(${err.code}): ${err.message}`); 
	}
}
main();
let close = false;
document.querySelector('.hamburger').addEventListener('click', function() {
    const menu = document.querySelector('.hammenu');
    // console.log(menu);
    menu.classList.toggle('show');
    if(!close){
        close =true;
        document.querySelector('.hamburger').children[0].src="Images/close.svg"
    }else{
        close = false;
        document.querySelector('.hamburger').children[0].src="Images/hamburger.svg"
    }
});


search.addEventListener('keydown', function(event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action (form submission)
        searchbutton.click(); // Trigger the button's click event
    }
});
searchbutton.addEventListener('click',async(e)=>{
    e.preventDefault();
    let city = search.value.trim();

    if (city==="") {
        alert("Please Enter a city name..");
        return;
    }
    setValues(city);
    set3daysValue(city,3);
})

async function set3daysValue(city,days=3) {
    if (city === "") {
        alert("Please Enter a city name..");
        return;
    }
    let getWeather = await fetch3DaysWeather(city,days);
    let data = getWeather.forecast.forecastday
    let location = getWeather.location;
    
    //updating header
    let time = document.querySelector(".timeDaily")
    let locationValue = document.querySelector(".locationvalueToday")
    time.innerHTML = data[0].date
    locationValue.textContent =" "+ location.name +" "+location.region+" "+ location.country;
    // updating daily forecast
    // console.log(data[0].hour[18]);
    
    let comp = document.querySelector(".contentOverlay");
    const children = comp.children;
    console.log(comp);
    // Loop through the children and remove all except the first one
    while (children.length > 1) {
    comp.removeChild(children[1]); // Always remove the second child
    }
    console.log(comp);
    for (let i = 0; i < getWeather.forecast.forecastday.length; i++) {
        let date = new Date(data[i].date)
    let parts= date.toString().split(' ');
    
    date = `${parts[0]} ${parts[1]} ${parts[2]}`;
        comp.innerHTML+=`<div class="line" style="margin-top: 20px;"></div>
                <div class="component">
                    <div class="undetailedInfo">
                        <div class="tabOne">
                            <span class="dateDaily">${date}</span>
                            <span class="temptoday"><span class="todayCurrrentTemp highesttemptoday">${data[i].day.maxtemp_c}</span>/<span class="lowesttemptoday">${data[i].day.mintemp_c}</span></span>
                            <span class="conditiontoday"><img class="weather-img" src="${data[i].day.condition.icon}" alt="Weather"><span>${data[i].day.condition.text}</span></span>
                        </div>
                        <div class="tabTwo">
                            <span><span class="material-symbols-outlined" style="font-size: unset;">
                                humidity_percentage
                                </span> <span>${data[i].day.avghumidity}%</span></span>
                            <span><span class="material-symbols-outlined" style="font-size: unset;">
                                air
                                </span> ${data[0].day.maxwind_kph} km/h</span>
                            <span class="material-symbols-outlined" style="font-size:30px;">
                                keyboard_arrow_up
                                </span>
                        </div>
                    </div>
                    <div class="detailedInfo" style="display: none;">
                        <div class="arrowDown"><span class="material-symbols-outlined" style="font-size:30px;">
                            keyboard_arrow_up
                            </span></div>
                        <div class="cardContainer">
                            <div class="card">
                                <div class="dayTime">${parts[0]} ${parts[2]} | Day</div>
                                <div class="tempdetails">
                                    <div class="tempdetailed">
                                    <div class="temperature3rdday">${data[i].day.maxtemp_c} °C</div>
                                            <img class="weather-img" src="${data[i].day.condition.icon}" alt="Weather">
                                    </div>
                                    <div class="setAndRise">
                                        <div class="sunrise">Sun Rise: ${data[i].astro.sunrise}</div>
                                        <div class="sunset">Sun Set: ${data[i].astro.sunset}</div>
                                    </div>
                                
                                </div>
                                <div class="conditiondetailed">
                                    Mist
                                </div>
                            </div>
                            <div class="card">
                                <div class="dayTime">${parts[0]} ${parts[2]} | Night</div>
                                <div class="tempdetails">
                                    <div class="tempdetailed">
                                    <div class="temperature3rdday">${data[i].day.mintemp_c} °C</div>
                                            <img class="weather-img" src="${data[i].hour[18].condition.icon}" alt="Weather">
                                    </div>
                                    <div class="setAndRise">
                                        <div class="sunrise">Moon Rise: ${data[i].astro.moonrise}</div>
                                        <div class="sunset">Moon Set: ${data[i].astro.moonset}</div>
                                    </div>
                                
                                </div>
                                <div class="conditiondetailed">
                                ${data[i].hour[18].condition.text}
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </div>`
    }
    //setting and selecting div value for daily weather
    let components = document.querySelectorAll(".component")
    console.log(components);
    // if (!close) {
    //     let cont = document.querySelector(".container")
    //     cont.style.position="static"
    //     cont.style.zIndex="unset"
    // }
    // css 
    components.forEach((component)=>{
        let showing = false;
    component.addEventListener("click",()=>{
        let undetailedCard = component.querySelector('.undetailedInfo')
        let detailedCard = component.querySelector('.detailedInfo')
        
        if(!showing){
            undetailedCard.style.display='none';
            detailedCard.style.display="block"
            showing = true;
            console.log("shoiwng");
            return;
        }
        if(showing){
            undetailedCard.style.display='flex';
            detailedCard.style.display="none"
            showing = false;
            console.log("hiding");
            return;
        }
        console.log("clicking", showing);
        
    })
    })
}
async function setValues(city) {
	if (city === "") {
        alert("Please Enter a city name..");
        return;
    }
	let getWeather = await fetchCurrentWeather(city);
    if (!getWeather) return;
	// console.log(getWeather);
	
	temperature.textContent = getWeather.current.temp_c + "°C";
    humidity.textContent = getWeather.current.humidity+" %";
    windSpeed.textContent =getWeather.current.wind_kph + " km/h";
    weather.src = `https:${getWeather.current.condition.icon}`;
    pressure.textContent = getWeather.current.pressure_mb +" mb";
    feel.textContent =getWeather.current.feelslike_c +"°C";
    region.textContent = " "+getWeather.location.region;
    location.textContent =" " + getWeather.location.name+","+getWeather.location.region+","+getWeather.location.country;
    time.textContent = getWeather.location.localtime;
	cloud.textContent = getWeather.current.cloud+" %";
	visibility.textContent = getWeather.current.vis_km + " km"
	winddirection.textContent = getWeather.current.wind_dir;
	lastupdate.textContent = getWeather.current.last_updated;
	condition.textContent = " "+getWeather.current.condition.text;
	heatindex.textContent = getWeather.current.heatindex_c +"°C";


    //background changes
    let conditionText = getWeather.current.condition.text.toLowerCase();
    
    switch (true) {
        case conditionText.includes("partly cloudy"):
            body.style.backgroundImage = "url('./Images/partlycloud.png')";
            break;
        case conditionText.includes("sunny"):
            body.style.backgroundImage = "url('./Images/sunny.png')";
            break;
        case conditionText.includes("cloudy"):
            body.style.backgroundImage = "url('./Images/cloudy.png')";
            break;
        case conditionText.includes("light rain"):
        case conditionText.includes("drizzle"):
        case conditionText.includes("patchy rain nearby"):
            body.style.backgroundImage = "url('./Images/lightrain.png')";
            break;
        case conditionText.includes("heavy rain"):
            console.log("working");
            
            body.style.backgroundImage = "url('./Images/heavyRainy.png')";
            break;
        case conditionText.includes("thunderstorm"):
            body.style.backgroundImage = "url('./Images/thunderstorm.png')";
            break;
        case conditionText.includes("snow"):
            body.style.backgroundImage = "url('./Images/snow.png')";
            break;
        case conditionText.includes("fog"):
            body.style.backgroundImage = "url('./Images/fog.png')";
            break;
        case conditionText.includes("windy"):
            body.style.backgroundImage = "url('./Images/windy.png')";
            break;
        case conditionText.includes("hail"):
            body.style.backgroundImage = "url('./Images/hail.png')";
            break;
        default:
            body.style.backgroundImage = "";
            break;
    }
}
const fetchCurrentWeather = async (city)=>{
    try {
        const api = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
        const response = await fetch(api);
        if(!response.ok) throw new Error("City Not Found");
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error.message)
        return null;
    }
}
const fetch3DaysWeather = async (city, days) => {
    try {
        const baseURL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no&alerts=no`;
        // const baseURL = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${days}&appid=${API_KEY_OPEN}`;
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        // console.log(data);
        return data
    } catch (error) {
        alert(error.message);
        return null;
    }
}