const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const yup = require("yup");
const monk = require("monk");
const csp = require("helmet-csp");
const middleware = require('./policies/middleware');
require("dotenv").config();

const API_KEY = process.env.API_KEY;

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
app.get("/", async (req, res, next) => {
  res.send('Hello')
});

