const cityInput = $("#search-city")
const allDays = $(".fiveday")
const apiKey = "&appid=78073e0fb19637db4240edbef624eb6e"
let city 
let listItem = $('<button class="cityButton">')
let temperature;
let humidity;
let wind;
let iconurl = localStorage.getItem("icon") || ""

function showLast() {
    city = localStorage.getItem("city");
    temperature = localStorage.getItem("temp");
    humidity = localStorage.getItem("humidity");
    wind = localStorage.getItem("wind");
    $("#city").text("The weather in "+city);
    $("#temp").text("Temperature: " + temperature);
    $("#humidity").text("Humidity: " + humidity);
    $("#wind").text("Wind Speed: " + wind);
    $("#icon").attr("src", iconurl);
}

showLast()



$("#search-button").on("click", function() {
    city =cityInput.val();
callWeather();}
)

function callWeather() {
    if (!cityInput) {
        alert("Please enter a city name!")
    }
    listItem.text(city)
    $("#history").append(listItem);

    $("#5day").removeClass("d-none");

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + apiKey,
        method: "GET"
    })
        .then(function (response) {
            console.log(response)


            let lat = response.coord.lat
            let lon = response.coord.lon
            cityID = response.id
            temperature = response.main.temp
            humidity = response.main.humidity
            wind = response.wind.speed
            iconResponse = response.weather[0].icon
            iconurl = "http://openweathermap.org/img/w/" + iconResponse + ".png";
            $("#city").text("The weather in " + city)
            $("#temp").text("Temperature: " + temperature)
            $("#humidity").text("Humidity: " + humidity)
            $("#wind").text("Wind Speed: " + wind)
            $("#icon").attr("src", iconurl)


            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + apiKey,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response)
                    let uv = response.value
                    $("#uv").text("UV index: " + uv)
                    if (uv >= 7) {
                        $("#uv").addClass("bg-danger")
                    }
                    if (uv > 5) {
                        $("#uv").addClass("bg-warning")
                    }
                    else {
                        $("#uv").addClass("bg-primary")
                    }
                    localStorage.setItem("city", city)
                    localStorage.setItem("temp", temperature)
                    localStorage.setItem("icon", iconurl)
                    localStorage.setItem("humidity", humidity)
                    localStorage.setItem("wind", wind)
                    localStorage.setItem("uv", uv)
                })
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial" + apiKey,
                method: "GET"
            })

                .then(function (response) {
                    console.log(response)
                    let dataDay = 1
                    let i = 5
                    let date
                    $(".fiveday").each(function(){
                        let daysArray = response.list
                        let iconResponse = daysArray[i].weather[0].icon
                        let iconurl = "http://openweathermap.org/img/w/" + iconResponse + ".png";
                        $("#temp" + dataDay).text(daysArray[i].main.temp)
                        $("#icon" + dataDay).attr("src", iconurl)
                        $("#humidity" + dataDay).text(daysArray[i].main.humidity)
                        date = moment().add(dataDay, 'days').format("MMMM Do")
                        $("#forcast" + dataDay).text(date)
                        console.log(date)
                        i = i+8
                        dataDay++
                    })
                })


        })
}

$(".cityButton").on("click", function() {
    console.log("click")
    city= $(this).text();
    callWeather();
})