(function () {
  var DARKSKY_API_URL = "https://api.darksky.net/forecast/";
  var DARKSKY_API_KEY = "4b135523ff97930537a3a7c9f215b38f";
  var CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  var GOOGLE_MAPS_API_KEY = "AIzaSyBMlgUXhwcnaIEId4sBuodUTTX1_-H8wMg";
  var GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

  // returns promise for a coordinate object
  function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url) // Returns a promise for a Response
        .then(response => response.json()) // Returns a promise for the parsed JSON
        .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
  }
  // returns current weather at passed in coordinates
  function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,alerts,flags`;

    return (
      fetch(url)
        .then(response => response.json())
        .then(data => data)
    );
  }

  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var cityWeather = app.querySelector('.city-weather');
  var temp = document.querySelector('#forecast');
  var forecastWeather = forecast.querySelector('.forecast-weather')




  cityForm.addEventListener('submit', function (event) { // this line changes
    $('.icon').addClass('hidden');
    
    cityWeather.innerText = "loading..."
    forecastWeather.innerHTML = "";
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.value; // Grab the current value of the input


    var types  = [
      "clear-day", "clear-night", "partly-cloudy-day",
      "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
      "fog"
    ]

    getCoordinatesForCity(city) // get the coordinates for the input city
      .then(getCurrentWeather) // get the weather for those coordinates
      .then(function (weather) {
        cityWeather.innerText = 'Current temperature: ' + weather.currently.temperature + "\n" + "Humidity: " + weather.currently.humidity + "\n" + "Precipitation: " + weather.currently.precipType + "\n" + "Summary: " + weather.currently.summary;


        for (i = 1; i < 6; i++) {
          var day = document.createElement("span");
          day.classList.add("day");
          for(j = 0;j< 11; j++){
            if(weather.daily.data[i].icon==types[j]){
              $('footer #icon'+(j+1+(i-1)*11)).removeClass('hidden');
            }
          }

          day.innerHTML = " " +  " high: " + weather.daily.data[i].temperatureHigh + "<p>"+ " low: " + weather.daily.data[i].temperatureLow + " ";
          forecastWeather.append(day);
        }
      });
    });
  })();

