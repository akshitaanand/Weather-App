'use strict';

localStorage.setItem('city', 'Dallas');

document.getElementById('today-city').innerHTML = localStorage.getItem('city')

const d = new Date();
document.getElementById("date").innerHTML = d;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let dayOfWeek = d.getDay()

const daysId = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
var counter = 0

// for (var i = dayOfWeek + 1; i < dayOfWeek + 1 + 6; i++) {
//     let count = i
//     let id = daysId[counter]
//     if (i > days.length - 1) {
//         count = i - days.length
//     }
//     document.getElementById(id).innerHTML = days[count];
//     counter++
// }

const getWeather = async (lat, lon) => {
    let url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7a012072942605e74e1d8edb38dacd5b"
    const request = await fetch(url);
    const data = await request.json();
    return data;
};


const displayWeather = async (lat, lon) => {
    getWeather(lat, lon).then(weather => {
        console.log(weather)
        document.getElementById('temp').innerHTML = weather.main.temp + " " + '°F'
        document.getElementById('desc').innerHTML = weather.weather[0].description
        document.getElementById('high').innerHTML = "High: " + weather.main.temp_max + '°F'
        document.getElementById('low').innerHTML = "Low: " + weather.main.temp_min + '°F'
    })
}

displayWeather(32.779167, -96.808891)

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

