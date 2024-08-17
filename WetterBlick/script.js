import { API_KEY ,PVT_TOKEN} from "./config.js"

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
		}
		)
		
		
		
		return; 

	} 

	function error(err) { 
		console.warn(`ERROR(${err.code}): ${err.message}`); 
	} 
}





main();
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
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        console.log(data);
        return data
    } catch (error) {
        alert(error.message);
        return null;
    }
}