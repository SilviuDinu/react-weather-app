const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const csp = require('helmet-csp');
const middleware = require('./policies/middleware');
const current_weather = require('./mocks/current-weather');
const current_location = require('./mocks/current-location');
const { default: axios } = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const MAPS_BASE_URL = process.env.MAPS_API_BASE_URL;
const BASE_URL = process.env.WEATHER_API_BASE_URL;

const app = express();
const port = process.env.PORT || 3001;
app.use(express.static(path.join('../build')));

app.listen(port, () => {
  console.log('Running on port ' + port);
});
app.enable('trust proxy');
app.use(helmet());
app.use(helmet.contentSecurityPolicy(middleware));
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// API
app.get('/', async (req, res) => {
  res.send('Hello');
});

app.get('/api/current/city', (req, res, next) => {
  const { cityName, units = 'metric' } = req.query;
  axios
    .get(`https://${BASE_URL}/weather?q=${cityName}&units=${units}&appid=${API_KEY}`)
    .then(response => {
      res.json([response.data]);
    })
    .catch(error => {
      next(error);
    });
});

app.get('/api/forecast/coords', (req, res, next) => {
  const { lat, lon, lang = 'en', exclude = 'minutely', units = 'metric' } = req.query;
  axios
    .get(`https://${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&lang=${lang}&appid=${API_KEY}`)
    .then(response => {
      res.json([response.data]);
    })
    .catch(error => {
      next(error);
    });
});

app.get('/api/current/coords', (req, res, next) => {
  const { lat, lon, units = 'metric' } = req.query;
  axios
    .get(`https://${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)
    .then(response => {
      res.json([response.data]);
    })
    .catch(error => {
      next(error);
    });
});

app.get('/api/current/location', (req, res, next) => {
  const { lat, lon, sensor = true } = req.query;
  const latlng = [lat, lon].join(',');
  axios
    .get(`https://${MAPS_BASE_URL}?latlng=${latlng}&sensor=${sensor}&key=${MAPS_API_KEY}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      next(error);
    });
});

// MOCKS
app.get('/mockapi/current/all', (req, res, next) => {
  try {
    res.json(current_weather);
  } catch (error) {
    next(error);
  }
});

app.get('/mockapi/current/city', (req, res, next) => {
  const { cityName } = req.query;
  console.log(cityName);
  const result = current_weather.find(item => item.name.toLowerCase() === cityName.toLowerCase());
  result ? res.json([result]) : next({ message: 'error' });
});

app.get('/mockapi/current/location', (req, res, next) => {
  const { lat, lon } = req.query;
  const latlng = [lat, lon].join(',');
  try {
    res.json(current_location);
  } catch (error) {
    next(error);
  }
});

app.get('/mockapi/current/coords', (req, res, next) => {
  const { lat, lon } = req.query;
  const result = current_weather.find(
    item => Math.abs(parseFloat(item.coord.lat, 3) - parseFloat(lat, 3)) < 0.05 && Math.abs(parseFloat(item.coord.lon, 3) - parseFloat(lon, 3)) < 0.05
  );
  result ? res.json([result]) : next({ message: 'error' });
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else res.status(500);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});
