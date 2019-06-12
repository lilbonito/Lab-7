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

// Weather
app.get('/weather', (request, response) => {

  try {
    let weatherArray = [];

    //Mock Data
    const mockWeatherData = require('./data/darksky.json');
    //Iterating through mock data
    mockWeatherData.daily.data.map(element => {
      let testWeather = new Weather(request.query.data, element);
      weatherArray.push(testWeather);
    });
    response.send(weatherArray);
  }
  catch(error) {
    handleError(error, response)
  }
});

// Location Constructor Function
function Location(query, geoData){
  this.search_query = query;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

// Weather Constructor Function
function Weather(query, darkSkyData){
  this.forecast = darkSkyData.summary;
  this.time = new Date(darkSkyData.time * 1000).toDateString();
}

// Error handling
function handleError(error, response) {
  console.error(error);
  response.status(500).send('Sorry, something went wrong')
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
