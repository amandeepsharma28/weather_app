"use strict";
// For converting °K -> °C : °C = °K - 273.15
const ZERO_ABS = -273.15;

/**
 * Make some usefull conversions
 */
const CONV = {
    /**
     * Convert °K -> °C
     */
    k_a_c : k => (k + ZERO_ABS).toFixed(1),
    k_a_f: k=>(((k+ZERO_ABS)*9/5)+32).toFixed(1),

    /**
     * Provides time with format hh:mm from timestamp
     */
    dt_a_hm : dt => {
        let date = new Date(dt * 1000);
        return ("0" + date.getHours()).substr(-2) + "h" + (date.getMinutes() + "0").substr(0,2);
    }

}

const OW_API = {
   // base_api_url : 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=d372021858e26c181fc642ca0f0dbd18',
    base_api_url:'http://api.openweathermap.org/data/2.5/',
    base_icon_url : 'http://openweathermap.org/img/w/',
    weather : 'weather?q={city}',
    forecast : 'forecast?q={city},{country}&cnt=24',
    key : '&APPID=c7df5d7a75d6a06e42c47b00a418aba7',

    //http:ttp://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=c7df5d7a75d6a06e42c47b00a418aba7
    get_weather_url : function(city) {
        return this.base_api_url + this.weather.replace('{city}', city) + this.key;
    },

    //http://api.openweathermap.org/data/2.5/forecast?q=Montreal,CA&cnt=24&APPID=c7df5d7a75d6a06e42c47b00a418aba7
    get_forecast_url : function(city) {
        return this.base_api_url + this.forecast.replace('{city}', city) + this.key;
    },

    //http://openweathermap.org/img/w/10d.png
    get_icon_url : function(icon_id) {
        return this.base_icon_url + icon_id + ".png";
    },
};

//event listener for forcast
document.getElementById("forecastButton").addEventListener("click",function(){
    let temp=document.getElementById("temp").value;
    let city=document.getElementById('city').value;
    console.log(city);
    let tbody = document.getElementsByTagName("tbody")[0];
    let trows=document.getElementsByTagName("tr");
    console.log(tbody);
while(tbody.firstElementChild.nextElementSibling)
{
    tbody.removeChild(tbody.firstElementChild.nextElementSibling);
}
    if(city!='select')
    {
        headingForcast.style.visibility='visible';
        currentHeading.style.visibility='visible';

//for current weather
fetch(OW_API.get_weather_url(city))
    .then(function(response){
        return response.json();
    })
    .then(function(obj){
        console.log(obj);
        let main = obj.main;
        console.log(main);
        let weather = obj.weather;
        if(weather[0].description.includes('cloud'))
        {
            document.body.style.backgroundImage="url('images/cloudy.jpg')";
        }
        else if(weather[0].description.includes('sunny'))
        {
            document.body.style.backgroundImage="url('images/sunny.jpg')";
        }
        else if(weather[0].description.includes('drizzle'))
        {
            document.body.style.backgroundImage="url('images/drizzle.jpg')";
        }
        
        else if(weather[0].description.includes('rain'))
        {
            document.body.style.backgroundImage="url('images/rainy.jpg')";
        }
        else{
            document.body.style.backgroundImage="url('images/weather.jpg')"; 
        }
        console.log(main.temp+"°K");
        console.log(weather[0].description);
        console.log(weather[0].icon);
        if(temp==='c')
        {
            document.querySelector(".temperature .val").textContent = CONV.k_a_c(main.temp);
        }
        else{
            document.querySelector(".temperature .val").textContent = CONV.k_a_f(main.temp);
        }
        document.querySelector(".description .val").textContent =weather[0].description;
        document.querySelector(".icon img").src = OW_API.get_icon_url(weather[0].icon);
    });

//for forcast    
fetch(OW_API.get_forecast_url(city))
    .then(function(response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        let trow = document.getElementById("tb_forecast").getElementsByClassName("model")[0];
        console.log(trow);
        //console.log(data.list);
        console.log(document.getElementsByClassName('hour'));
        console.log(data.list[0].dt_txt.substr(0,10));
        for(let l of data.list)
        {
            let date=l.dt_txt.substr(0,10);
            let cln = trow.cloneNode(true);            
            cln.classList.remove("model");
            tbody.appendChild(cln);
            cln.querySelector(".hour").textContent = l.dt_txt;
            cln.querySelector("img").src = OW_API.get_icon_url(l.weather[0].icon); 
            cln.querySelector(".description").textContent = l.weather[0].description;
            if(temp==='c')
            {
                cln.querySelector(".temperature").textContent = CONV.k_a_c(l.main.temp);
            }
            else{
                cln.querySelector(".temperature").textContent = CONV.k_a_f(l.main.temp);
            }
        }

        //table styling
        for(let i=1; i<table.rows.length; i++){
            if(i%2 == 0){
                table.rows[i].style.backgroundColor = "skyblue";
            } else {
                table.rows[i].style.backgroundColor = "white";
            }
        }

    });
}
else{
    headingForcast.style.visibility='hidden';
    currentHeading.style.visibility='hidden';
}
});


let mainHeading = document.querySelector("#report");
mainHeading.style.backgroundColor = "darkorchid";
mainHeading.style.textAlign = "center";
mainHeading.style.opacity="0.8";
mainHeading.style.borderRadius="30px";
mainHeading.style.height = "185px";
mainHeading.style.fontSize = "25px";

document.getElementById("city").style.width = "200px";
document.getElementById("city").style.height = "25px";
document.getElementById("temp").style.height = "25px";
document.getElementById("forecastButton").style.fontSize = "20px"; 

let currentHeading = document.getElementById("current");
currentHeading.style.backgroundColor = "yellow";
currentHeading.style.visibility='hidden';
currentHeading.style.opacity="0.8";
currentHeading.style.borderRadius="30px";
currentHeading.style.textAlign = "center";
currentHeading.style.fontSize = "20px";

let headingForcast = document.getElementById("forecast");
headingForcast.style.visibility='hidden';
headingForcast.style.opacity="0.8";
headingForcast.style.borderRadius="30px";
headingForcast.style.textAlign = "center";
headingForcast.style.fontSize = "20px"


//table styling
let table = document.getElementById("tb_forecast");
table.style.width = 100+'%';
table.style.textAlign = "center";
document.querySelector("thead").style.backgroundColor = "skyblue";
