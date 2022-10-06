'use strict';

localStorage.setItem('city', 'Dallas');

document.getElementById('today-city').innerHTML = localStorage.getItem('city')

const d = new Date().toLocaleString();
document.getElementById("date").innerHTML = d;


const country = async () => {
    const req = await fetch('https://countriesnow.space/api/v0.1/countries/states')
    const countryList = await req.json()
    console.log(countryList)
    countryOptions(countryList.data, "country-select")
}

const countryOptions = (list, dropdown) => {
    for (var i = 0; i < list.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = list[i].name
        document.getElementById(dropdown).appendChild(option)
    }
}

const cityOptions = (list) => {
    for (var i = 0; i < list.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = list[i]
        document.getElementById("city-select").appendChild(option)
    }
}

country()

localStorage.setItem('country', '');
localStorage.setItem('state', '');
localStorage.setItem('city-select', '');

document.getElementById("country-select").addEventListener("change", function () {
    console.log(this.value)
    localStorage.setItem('country', this.value);
    let items = document.getElementById('state-select');
    items.innerHTML = '';
    let option = document.createElement("option")
    option.innerHTML = "Choose a State"
    document.getElementById("state-select").appendChild(option)
    state(this.value)
})

document.getElementById("state-select").addEventListener("change", function () {
    console.log(this.value)
    localStorage.setItem('state', this.value)
    city(localStorage.getItem('country'), localStorage.getItem('state'))
    let items = document.getElementById('city-select');
    items.innerHTML = '';
    let option = document.createElement("option")
    option.innerHTML = "Choose a City"
    document.getElementById("city-select").appendChild(option)
})

document.getElementById("city-select").addEventListener("change", function () {
    console.log(this.value)
    localStorage.setItem('city-select', this.value)
})

const state = async (country) => {
    const req = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: country })
    })
    const stateList = await req.json()
    console.log(stateList)
    localStorage.setItem("iso3", stateList.data.iso3)
    countryOptions(stateList.data.states, "state-select")
}

const city = async (country, state) => {
    const req = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: country, state: state })
    })
    const cityList = await req.json()
    console.log(cityList)
    cityOptions(cityList.data)
}

const getWeather = async (lat, lon) => {
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7a012072942605e74e1d8edb38dacd5b"
    const request = await fetch(url);
    const data = await request.json();
    return data;
};


const displayWeather = async (lat, lon) => {
    getWeather(lat, lon).then(weather => {
        if (weather.weather[0].description == "few clouds") {
            document.getElementById('weather_gif').src = "./images/light-cloud.gif"
        }
        else if (weather.weather[0].description == "shower rain" || weather.weather[0].description == "rain") {
            document.getElementById('weather_gif').src = "./images/rain.gif"
        }
        else if (weather.weather[0].description == "thunderstorm") {
            document.getElementById('weather_gif').src = "./images/thunder.gif"
        }
        else if (weather.weather[0].description == "snow") {
            document.getElementById('weather_gif').src = "./images/snow.gif"
        }
        else if (weather.weather[0].description == "mist") {
            document.getElementById('weather_gif').src = "./images/windy.gif"
        }
        else if (weather.weather[0].description == "clear sky") {
            document.getElementById('weather_gif').src = "./images/sunny.gif"
        }
        else {
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

displayWeather(32.779167, -96.808891)

const getCoordinates = async (city, countryCode) => {
    let url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ", " + countryCode + "&limit=1&appid=7a012072942605e74e1d8edb38dacd5b"
    const request = await fetch(url)
    const data = await request.json()
    return data;
}

document.getElementById("submit").onclick = onSubmit;

async function onSubmit(event) {
    event.preventDefault()
    if (localStorage.getItem("country") == "" || localStorage.getItem("state") == "") {
        document.getElementById("no-country").innerHTML = "please select a country"
        document.getElementById("no-state").innerHTML = "please select a state"
    }
    else {
        document.getElementById("no-country").innerHTML = ""
        document.getElementById("no-state").innerHTML = ""
        var city = localStorage.getItem('city-select')
        localStorage.setItem('city', city);
        document.getElementById('today-city').innerHTML = localStorage.getItem('city-select')
        if (city == "") {
            city = localStorage.getItem("state")
            document.getElementById('today-city').innerHTML = localStorage.getItem('state')
        }
        let coord = await getCoordinates(city, localStorage.getItem("iso3"))
        console.log(city + localStorage.getItem("iso3"))
        await displayWeather(coord[0].lat, coord[0].lon)
    }
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    if (min < 10) {
        min = "0" + min
    }
    if (hour > 12) {
        hour = hour - 12
    }
    var time = hour + ':' + min;
    return time;
}




