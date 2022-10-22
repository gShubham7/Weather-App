//http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=9061b1bfcce37287d38ef58a05313dfd
//to get icon---->>>//<Image source={{ uri: ``http://openweathermap.org/img/w/${icon}.png`` }} />

document.getElementById("searchBtn").addEventListener("click", getWeather)
async function getWeather(x) {
    let city = document.getElementById("search-box").value || x.name;
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=9061b1bfcce37287d38ef58a05313dfd&units=metric`);
    let data = await res.json();
    //console.log(data);
    //displayData(data);
    weekForcast(data);
}

async function weekForcast(data) {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=9061b1bfcce37287d38ef58a05313dfd&units=metric`);
    let weekData = await res.json();
    //console.log(data, weekData);
    displayData(data, weekData);
}

let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let week = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];


function displayData(data, weekData) {

    document.getElementById("container").innerHTML = null;
    document.getElementById("weekForcast").innerHTML = null;
    let details = document.createElement("div");
    details.id = "details";
    let date = document.createElement("h3");
    let today = new Date();
    let currentDate = (month[today.getMonth()]) + " " + today.getDate() + ", " + today.getHours() + ":" + today.getMinutes();
    date.innerText = currentDate;
    let city = document.createElement("h3");
    city.id = "city";
    city.innerText = data.name;
    let icon = document.createElement("img");
    let logo = data.weather[0].icon;
    icon.src = `http://openweathermap.org/img/w/${logo}.png`;
    let temp = document.createElement("span");
    temp.innerText = Math.round(data.main.temp) + `\u00B0` + "C";
    let surround = document.createElement("h3");
    surround.innerText = "Feels like " + Math.round(data.main.feels_like) + `\u00B0` + "C" + " " + data.weather[0].description;

    let weather_data = document.createElement("div");
    weather_data.id = "weather-data";
    let wind = document.createElement("h3");
    let w_speed = document.createElement("span");
    w_speed.innerText = "Wind Speed: " + data.wind.speed + "m/s";
    let pressure = document.createElement("span");
    pressure.innerText = "Pressure: " + data.main.pressure + "hPa";
    wind.append(w_speed, pressure);

    let humidity = document.createElement("h3");
    let humid = document.createElement("span");
    humid.innerText = "Humidity: " + data.main.humidity + "%";
    let visibility = document.createElement("span");
    visibility.innerText = "Visibility: " + data.visibility / 1000 + "km";
    humidity.append(humid, visibility);

    let tempMinMax = document.createElement("h3");
    let temp_max = document.createElement("span");
    temp_max.innerText = "Max Temp: " + Math.round(data.main.temp_max) + `\u00B0` + "C";
    let temp_min = document.createElement("span");
    temp_min.innerText = "Min Temp: " + Math.round(data.main.temp_min) + `\u00B0` + "C";
    tempMinMax.append(temp_max, temp_min);

    let sun = document.createElement("h3");
    let sunrise = document.createElement("span");
    let unix = data.sys.sunrise;
    sunrise.innerText = "Sunrise at: " + new Date(unix * 1000).getHours() + ":" + new Date(unix * 1000).getMinutes();
    let sun1 = document.createElement("h3");
    let sunset = document.createElement("span");
    let unix1 = data.sys.sunset;
    sunset.innerText = "Sunset at: " + new Date(unix1 * 1000).getHours() + ":" + new Date(unix1 * 1000).getMinutes();
    sun.append(sunrise);
    sun1.append(sunset);

    let map_div = document.createElement("iframe");
    map_div.id = "map";
    map_div.src = `https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    weather_data.append(wind, humidity, tempMinMax, sun, sun1);
    details.append(date, city, icon, temp, surround, weather_data);
    document.getElementById("container").append(details, map_div);

    let arr = weekData.daily
    //console.log(arr)
    arr.forEach(function (el) {
        let div = document.createElement("div");
        let day = document.createElement("h3");
        //day.innerText = day[new Date((el.dt)*1000).getDay()];
        day.innerText = week[new Date(el.dt * 1000).getDay()];
        let icon = document.createElement("img");
        icon.src = `http://openweathermap.org/img/w/${el.weather[0].icon}.png`;
        let maxTemp = document.createElement("h3");
        maxTemp.innerText = Math.round(el.temp.max) + `\u00B0`;
        let minTemp = document.createElement("h3");
        minTemp.innerText = Math.round(el.temp.min) + `\u00B0`;
        div.append(day, icon, maxTemp, minTemp);
        document.getElementById("weekForcast").append(div);
    });
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

window.addEventListener("load", function () {
    navigator.geolocation.getCurrentPosition(success, error, options);
})

async function success(pos) {
    //console.log("inside")
    const crd = pos.coords;
    let lat = crd.latitude;
    let lon = crd.longitude;
    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9061b1bfcce37287d38ef58a05313dfd`);
    let data = await res.json();
    //console.log(data.name);
    getWeather(data);
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
}