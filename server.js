'use strict';

// Load Environment Variable from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

let errorObject = {
  status : 500,
  responseText : "Sorry, something went wrong",
}

// Location
app.get('/location', (request, response) => {

  try {
    // Mock DATA
    const mockLocationData = require('./data/geo.json');
    const location = new Location(request.query.data, mockLocationData.results[0]);
    response.send(location);
  }
  catch(error) {
    handleError(error, response);
  }
});

// Location Constructor Function
function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

// Weather
app.get('/weather', (request, response) => {

  try {
    let weatherArray = [];

    //Mock Data
    const mockWeatherData = require('./data/darksky.json');
  
    for (var i = 0; i < mockWeatherData.daily.data.length; i++){
      
      const testWeather = new Weather(request.query.data, mockWeatherData.daily.data[i]);
      weatherArray.push(testWeather);
    }
    response.send(weatherArray);
  }
  catch(error) {
    handleError(error, response)
  }
});

// Weather Constructor Function
function Weather(query, darkSkyData){
  this.forecast = darkSkyData.summary;
  this.time = new Date(darkSkyData.time * 1000).toDateString();
}

function handleError(error, response) {
  console.error(error);
  response.status(500).send('Sorry, something went wrong')
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
