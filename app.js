'use strict';

localStorage.setItem('city', 'Dallas');

document.getElementById('today-city').innerHTML = localStorage.getItem('city')

const d = new Date().toLocaleString();
document.getElementById("date").innerHTML = d;


const cities = async () => {
    const req = await fetch('https://countriesnow.space/api/v0.1/cities')
    const cts = await req.json()
    console.log(cts)
}

cities()

const getWeather = async (lat, lon) => {
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7a012072942605e74e1d8edb38dacd5b"
    const request = await fetch(url);
    const data = await request.json();
    return data;
};


const displayWeather = async (lat, lon) => {
    getWeather(lat, lon).then(weather => {
        if(weather.weather[0].description == "few clouds"){
            document.getElementById('weather_gif').src = "./images/light-cloud.gif"
        }
        else if(weather.weather[0].description == "shower rain" || weather.weather[0].description == "rain"){
            document.getElementById('weather_gif').src = "./images/rain.gif"
        }
        else if(weather.weather[0].description == "thunderstorm"){
            document.getElementById('weather_gif').src = "./images/thunder.gif"
        }
        else if(weather.weather[0].description == "snow"){
            document.getElementById('weather_gif').src = "./images/snow.gif"
        }
        else if(weather.weather[0].description == "mist"){
            document.getElementById('weather_gif').src = "./images/windy.gif"
        }
        else if(weather.weather[0].description == "clear sky"){
            document.getElementById('weather_gif').src = "./images/sunny.gif"
        }
        else{
            document.getElementById('weather_gif').src = "./images/cloudy.gif"
        }
        document.getElementById('temp').innerHTML = weather.main.temp + " " + '°F'
        document.getElementById('desc').innerHTML = weather.weather[0].description
        document.getElementById('high').innerHTML = "High: " + weather.main.temp_max + '°F'
        document.getElementById('low').innerHTML = "Low: " + weather.main.temp_min + '°F'
        document.getElementById('low').innerHTML = "Low: " + weather.main.temp_min + '°F'
        document.getElementById('sunrise').innerHTML = timeConverter(weather.sys.sunrise) + " AM"
        document.getElementById('wind').innerHTML = weather.wind.speed + " meter/sec"
        document.getElementById('sunset').innerHTML = timeConverter(weather.sys.sunset) + " PM"
        document.getElementById('humid').innerHTML = weather.main.humidity + "%"
    })
}

//displayWeather(32.779167, -96.808891)

const getCoordinates = async (city) => {
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=7a012072942605e74e1d8edb38dacd5b"
    const request = await fetch(url)
    const data = await request.json()
    return data;
}

document.getElementById("submit").onclick = onSubmit;

async function onSubmit(event) {
    event.preventDefault()
    var city = document.getElementById('city').value
    localStorage.setItem('city', city);
    document.getElementById('today-city').innerHTML = localStorage.getItem('city')
    console.log(city)

    let coord = await getCoordinates(city)
    await displayWeather(coord[0].lat, coord[0].lon)
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if(min < 10){
        min = "0" + min
    }
    if(hour > 12){
        hour = hour-12
    }
    var time = hour + ':' + min;
    return time;
  }

//   $('.basicAutoComplete').autoComplete({
//     resolverSettings: {
//         url: [
//             "Google Cloud Platform",
//             "Amazon AWS",
//             "Docker",
//             "Digital Ocean"
//         ]
//     }
// });



