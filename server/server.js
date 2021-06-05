const path = require("path");
var http = require('http');
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const csp = require("helmet-csp");
const middleware = require('./policies/middleware');
require("dotenv").config();

const API_KEY = process.env.API_KEY;
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
  res.send('Hello')
});

app.get('/api/current/', (req, res) => {
  const { cityName } = req.query;
  try {
    const options = new URL(`${BASE_URL}?q=${cityName}&units=metric&appid=${API_KEY}`);
    http.request(options, (res) => {
      console.log(res);
    });
  }
  catch {
    console.error('GET /api/current/:cityName went wrong')
  }
});

