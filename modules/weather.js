function getForecasts(query, client, superagent) {
  return getStoredWeather(query, client).then(weatherData => {
    if (weatherData) {
      return weatherData;
    } else {
      return getWeatherFromAPI;
    }
  });
}

function getStoredWeather(query, client) {
  const SQL = `SELECT * FROM weathers WHERE location_id'${id}'`;
  return client.query(SQL).then(results => {
    return results.rows[0];
  });
}

function getWeatherFromAPI(query, client, superagent) {
  const URL = `https://api.darksky.net/forecast/${
    process.env.WEATHER_API_KEY
  }/${query.latitude},${query.longitude}`;
  
  return superagent
    .get(URL)
    .then(response => response.body.daily.data)
    .then(days => days.map(day => new Weather(day)));
}

function Weather(query, darkSkyData) {
  this.forecast = darkSkyData.summary;
  this.time = new Date(darkSkyData.time * 1000).toDateString();
}
