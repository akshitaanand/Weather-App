'use strict';

localStorage.setItem('city', 'Dallas');

document.getElementById('today-city').innerHTML = localStorage.getItem('city')

document.getElementById("submit").onclick = onSubmit;
function onSubmit(event){
    event.preventDefault()
    var city = document.getElementById('city').value
    localStorage.setItem('city', city);
    document.getElementById('today-city').innerHTML = localStorage.getItem('city')
    console.log(city)
}

