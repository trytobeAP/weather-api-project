const time_zone_el = document.querySelector(".time_zone")
const clock_el = document.querySelector(".clock")
const am_pm_el = document.querySelector(".am_pm")
const date_el = document.querySelector(".date")

const value_el = document.querySelectorAll(".Value")
const w_icon_el = document.querySelectorAll(".w-icon")
const temp_el = document.querySelectorAll(".temp")
const weather_forecast_item_el = document.querySelectorAll(".weather_forecast_item");

const day_arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month_arr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function city_coord_API(){
    let city_url = "http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=c2823683bdc913fdce53eb7f3ba6682c";
    let response = await fetch(city_url);
    let city_coord = await response.json();
    let lat = city_coord[0].lat;
    let lon = city_coord[0].lon;
    url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=c2823683bdc913fdce53eb7f3ba6682c`;
    take_weather_API(url);
}

async function take_weather_API(){
    let response = await fetch(url);
    let weather_API = await response.json();
    start_work(weather_API);
}

function temp(day_number, weather){
    let temp_day_celsius = weather.daily[day_number].temp.day - 273.15;
    let temp_night_celsius = weather.daily[day_number].temp.night - 273.15;
    let day_night = [];
    temp_day_celsius = Math.round(temp_day_celsius * 10) / 10;
    temp_night_celsius = Math.round(temp_night_celsius * 10) / 10;
    day_night[0] = temp_day_celsius;
    day_night[1] = temp_night_celsius;
}

function weather_temp(weather){
    let day_count = 0;
    let day_temp;
    let night_temp;
    temp_el.forEach((el) => {
        day_temp = temp(Math.floor(day_count/2), weather)[0];
        night_temp = temp(Math.floor(day_count/2), weather)[1];
        if(day_count % 2 === 0) el.innerHTML = `Day: ${day_temp}&#176; C`;
        else el.innerHTML = `Night: ${night_temp}&#176; C`;
        day_count += 1;
    });
    day_count = 0;
    w_icon_el.forEach(el =>{
        el.src = `http://openweathermap.org/img/wn/${weather.daily[day_count].weather[0].icon}@2x.png`
        day_count += 1;
    });
}

function current_time(weather, forecast){
    let time = new Date();
    let day = time.getDay();
    let date = time.getDate();
    let month = time.getMonth();
    let setId;
    setId = setInterval(() =>{
        time = new Date();
        month = time.getMonth();
        date = time.getDate();
        day = time.getDay();
        const hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
        const min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
        const ampm = hour >= 12 ? "PM" : "AM";
        clock_el.innerHTML = `${hour}:${min}`;
        am_pm_el.innerHTML = `${ampm}`;
        date_el.innerHTML = `${day_arr[day]}, ${date} ${month_arr[month]}`;
    },1000)
    if(forecast !== undefined && forecast !== day_arr[day]){
        for(let i = 0; i < setId; i++) clearInterval(setId - i);
        clock_el.innerHTML = "Forecast not for today"
        am_pm_el.innerHTML = "";
        date_el.innerHTML = `${day_arr[forecast]}, ${date - (day - ((forecast !== 0) ? forecast : 7))} ${month_arr[month]}`
    }
    if(forecast !== undefined) value_change(forecast, weather)
    else value_change(day, weather)
}

function value_change(day_number, weather){
    value_el[0].innerHTML = `${weather.daily[day_number].humidity}%`;
    value_el[1].innerHTML = weather.daily[day_number].pressure;
    value_el[2].innerHTML = weather.daily[day_number].wind_speed;
}

function time_zone_change(weather){
    time_zone_el.innerHTML = weather.timezone;
}

function click_on_forecast(){
    weather_forecast_item_el.forEach((item, num) =>{
        item.onclick = () =>{
            for(let i = 0; i < weather_forecast_item_el.length; i++) weather_forecast_item_el[i].style.border = "1px solid black";
            item.style.border = "1px solid #FADF05";
            take_weather_forecast(num, weather)
        }
    })
}

function take_weather_forecast(date_num, weather){
    if (date_num === 6) date_num = -1;
    current_time(weather, date_num + 1);
}

function start_work(weather_obj){
    console.log(weather_obj);
    click_on_forecast(weather_obj);
    time_zone_change(weather_obj);
    current_time(weather_obj);
    weather_temp(weather_obj);
}

city_coord_API()