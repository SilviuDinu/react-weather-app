const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const csp = require("helmet-csp");
const middleware = require("./policies/middleware");
const current_weather = require("./mocks/current-weather");
const current_location = require("./mocks/current-location");
const { default: axios } = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const MAPS_BASE_URL = process.env.MAPS_API_BASE_URL;
const BASE_URL = process.env.WEATHER_API_BASE_URL;

const app = express();
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Running on port " + port);
});
app.enable("trust proxy");
app.use(helmet());
app.use(helmet.contentSecurityPolicy(middleware));
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// API
app.get("/", async (req, res) => {
  res.send("Hello");
});

app.get("/api/current/city", (req, res) => {
  const { cityName, units = "metric" } = req.query;
  axios
    .get(`https://${BASE_URL}?q=${cityName}&units=${units}&appid=${API_KEY}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

app.get("/api/current/location", (req, res) => {
  const { lat, long, sensor = true } = req.query;
  const latlng = [lat, long].join(",");
  axios
    .get(
      `https://${MAPS_BASE_URL}?latlng=${latlng}&sensor=${sensor}&key=${MAPS_API_KEY}`
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(400).send({ error });
    });
});

// MOCKS
app.get("/mockapi/current/all", (req, res) => {
  try {
    res.json(current_weather);
  } catch {
    res.status(400).send({ error: "Something went wrong with the mock" });
  }
});

app.get("/mockapi/current/city", (req, res) => {
  const { cityName } = req.query;
  const result = current_weather.find(
    (item) => item.name.toLowerCase() === cityName.toLowerCase()
  );
  result
    ? res.json([result])
    : res.status(400).send({ error: `Could not find ${cityName}` });
});

app.get("/mockapi/current/location", (req, res) => {
  const { lat, long } = req.query;
  const latlng = [lat, long].join(",");
  try {
    res.json(current_location);
  } catch {
    res
      .status(400)
      .send({ error: "Something went wrong while getting your location" });
  }
});
