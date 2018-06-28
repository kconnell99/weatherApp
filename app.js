(function(){
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
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
  }

  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var cityWeather = app.querySelector('.city-weather');

  cityForm.addEventListener('submit', function(event) { // this line changes
    cityWeather.innerText = "loading..."
    
    event.preventDefault(); // prevent the form from submitting
    
    var city = cityInput.value; // Grab the current value of the input

    getCoordinatesForCity(city) // get the coordinates for the input city
    .then(getCurrentWeather) // get the weather for those coordinates
    .then(function(weather) {
      cityWeather.innerText = 'Current temperature: ' + weather.temperature + "\n" + "Humidity: " + weather.humidity +"\n" + "Precipitation: " + weather.precipType +  "\n" + "Summary: "+weather.summary;
    });
  });
  var s1 = document.querySelector("#app")
  s1.classList.add("bg");

  var s2 = document.querySelector("#app")
  s2.classList.add("font")

})();
