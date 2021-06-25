const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const cors = require("cors");
const csp = require("helmet-csp");
const middleware = require("./policies/middleware");
const current_weather = require("./mocks/current-weather");
const onecall = require("./mocks/one-call");
const { default: axios } = require("axios");
const coordsByCity = require("./mocks/coords-by-city");
const cityByCoords = require("./mocks/city-by-coords-google");
const cityByCoordsOpenweather = require("./mocks/city-by-coords-openweather");
const { schema } = require("./schemas/location");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const locations = mongoose.connection.collection("locations");

const API_KEY = process.env.API_KEY;
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const MAPS_BASE_URL = process.env.MAPS_API_BASE_URL;
const BASE_URL = process.env.WEATHER_API_BASE_URL;
const WEATHER_API_GEOCODING = process.env.WEATHER_API_GEOCODING;

const app = express();
app.enable("trust proxy");
app.use(helmet());
app.use(helmet.contentSecurityPolicy(middleware));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;
app.use(express.static(path.join("../build")));

app.listen(port, () => {
  console.log("Running on port " + port);
});

// API
app.get("/", async (req, res) => {
  res.send("Hello. this route doesn't provide anything special");
});

/*
This will call the weather api and return the current weather
of the city given in the search params string. Units specifies
if the measurement will be done in metric, imperial or standard.
*/
app.get("/api/current/city", (req, res, next) => {
  const { cityName, units = "metric" } = req.query;
  axios
    .get(
      `https://${BASE_URL}/weather?q=${cityName}&units=${units}&appid=${API_KEY}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      next(error);
    });
});

/*
This is the one-huge-call endpoint that will return current forecast,
hourly forecast (for 48 hours) and daily forecast for the next 8 days
for a specific given latitute and longitude.

The exclude param mentions which type of forecast to exclude from the 
response (e.g. minutely).
*/
app.get("/api/one/coords", (req, res, next) => {
  const {
    lat,
    lon,
    lang = "en",
    exclude = "minutely",
    units = "metric",
    cityName,
  } = req.query;
  axios
    .get(
      `https://${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&lang=${lang}&appid=${API_KEY}`
    )
    .then((response) => {
      res.json({ ...response.data, cityName });
    })
    .catch((error) => {
      next(error);
    });
});

/*
This will return the current weather only for the given
latitude and longitude. You can also specifiy units of measurement.
*/
app.get("/api/current/coords", (req, res, next) => {
  const { lat, lon, units = "metric" } = req.query;
  axios
    .get(
      `https://${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      next(error);
    });
});

/*
This will call the geocoding api and return the name of the city
based on the latitute and logitute given in the query string params.

The first call relies on the openweathermap.com api.
If the RETRY param is specified, and the first call fails, the 
google.com geocoding api will be called as a fallback.
*/
app.get("/api/current/coords-to-city", (req, res, next) => {
  const { lat, lon, sensor = true, retry = false } = req.query;
  const latlng = [lat, lon].join(",");
  axios
    .get(
      `https://${WEATHER_API_GEOCODING}/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )
    .then((response) => {
      res.json({ ...response.data[0], cityName: response.data[0].name });
    })
    .catch((error) => {
      retry
        ? axios
            .get(
              `https://${MAPS_BASE_URL}?latlng=${latlng}&sensor=${sensor}&key=${MAPS_API_KEY}`
            )
            .then((response) => {
              res.json(
                response.data.results[0].address_components[2].long_name
              );
              updateDB({
                city: response.data.results[0].address_components[2].long_name,
                lat: response.data.results[0].geometry.location.lat,
                lon: response.data.results[0].geometry.location.lon,
              });
            })
            .catch((error) => {
              next(error);
            })
        : next(error);
    });
});

/*
This will do the opposite of the above endpoint.
It will return the coords (lat, lon) of the given location
from the query string params
*/
app.get("/api/current/city-to-coords", (req, res, next) => {
  const { cityName, countryCode } = req.query;
  const url = countryCode
    ? `https://${WEATHER_API_GEOCODING}/direct?q=${cityName},${countryCode}&appid=${API_KEY}`
    : `https://${WEATHER_API_GEOCODING}/direct?q=${cityName}&appid=${API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      const data = {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        cityName: response.data[0].name,
        localNames: response.data[0].local_names,
      };
      res.json({
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        cityName: response.data[0].name,
        localNames: response.data[0].local_names,
      });
      updateDB({
        city: response.data[0].name,
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      });
    })
    .catch((error) => {
      next(error);
    });
});

// MOCKS
app.get("/mockapi/current/all", (req, res, next) => {
  try {
    res.json(current_weather);
  } catch (error) {
    next(error);
  }
});

app.get("/mockapi/current/city", (req, res, next) => {
  const { cityName } = req.query;
  const result = current_weather.find(
    (item) => item.name.toLowerCase() === cityName.toLowerCase()
  );
  result ? res.json(result) : next({ message: "error" });
});

app.get("/mockapi/current/coords-to-city", (req, res, next) => {
  const { lat, lon } = req.query;
  const latlng = [lat, lon].join(",");
  try {
    const result = cityByCoordsOpenweather.find(
      (item) =>
        Math.abs(parseFloat(item.lat, 3) - parseFloat(lat, 3)) < 0.1 &&
        Math.abs(parseFloat(item.lon, 3) - parseFloat(lon, 3)) < 0.1
    );
    if (result) {
      res.json(result);
      updateDB({ city: result.name, lat: result.lat, lon: result.lon });
    } else {
      next({ message: "error" });
    }
  } catch (error) {
    next(error);
  }
});

app.get("/mockapi/current/city-to-coords", (req, res, next) => {
  const { cityName } = req.query;
  try {
    const result = coordsByCity.find(
      (item) =>
        item.name.toLowerCase() === cityName.toLowerCase() ||
        Object.keys(item.local_names).some(
          (key) =>
            item.local_names[key].toLowerCase() === cityName.toLowerCase()
        )
    );
    const data = {
      lat: result.lat,
      lon: result.lon,
      cityName: result.name,
      localNames: result.local_names,
    };
    result
      ? res.json({
          lat: result.lat,
          lon: result.lon,
          cityName: result.name,
          localNames: result.local_names,
        })
      : next({ message: "error" });
    updateDB({
      lat: result.lat,
      lon: result.lon,
      city: result.name,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/mockapi/current/coords", (req, res, next) => {
  const { lat, lon } = req.query;
  try {
    const result = current_weather.find(
      (item) =>
        Math.abs(parseFloat(item.coord.lat, 3) - parseFloat(lat, 3)) < 0.05 &&
        Math.abs(parseFloat(item.coord.lon, 3) - parseFloat(lon, 3)) < 0.05
    );
    result ? res.json(result) : next({ message: "error" });
  } catch (error) {
    result ? res.json(result) : next({ message: error });
  }
});

app.get("/mockapi/one/coords", (req, res, next) => {
  const {
    lat,
    lon,
    lang = "en",
    exclude = "minutely",
    units = "metric",
    cityName,
  } = req.query;
  const city =
    cityName.charAt(0).toUpperCase() + cityName.toLowerCase().slice(1);
  try {
    res.json({ ...onecall[0], cityName: city });
  } catch (err) {
    next(err);
  }
  // const result = onecall.find(
  //   item => Math.abs(parseFloat(item.lat, 3) - parseFloat(lat, 3)) < 0.05 && Math.abs(parseFloat(item.lon, 3) - parseFloat(lon, 3)) < 0.05
  // );
  // result ? res.json({...onecall[0], cityName}) : next({ message: 'error' });
});

const updateDB = async (data) => {
  try {
    schema
      .validate({ ...data })
      .then(async () => {
        const done = await locations.update(
          { city: data.city },
          { ...data },
          {
            upsert: true,
          }
        );
      })
      .catch((err) => console.log(err));
  } catch (err) {
    next(err);
  }
};

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else res.status(500);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  });
});
