'use strict';

//Variables
let location;

// Load Environment Variable from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Can have routes cleanly and not in line
app.get('/location', handleLocationRequest);
app.get('/weather', handleWeatherRequest);

function handleLocationRequest(request, response){
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(URL)
    .then(res => {
      // console.log('response from geocode api', res.body.results[0]);
      location = new Location(request.query.data, res.body);
      response.send(location)
    })
    .catch(error => {
      handleError(error);
    })
}

function handleWeatherRequest(request, response){
  const URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${location.latitude},${location.longitude}`;

  return superagent.get(URL)
    .then(res => {
      let weather = res.body.daily.data.map(element => {
        return (new Weather(request.query.data, element));
        
      })
      console.log(weather);
      response.send(weather);
    })
    .catch(error => {
      handleError(error);
    })
}

// Location Constructor Function
function Location(query, rawData){
  this.search_query = query;
  this.formatted_query = rawData.results[0].formatted_address;
  this.latitude = rawData.results[0].geometry.location.lat;
  this.longitude = rawData.results[0].geometry.location.lng;
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
