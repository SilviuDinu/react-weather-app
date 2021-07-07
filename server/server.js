const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const csp = require("helmet-csp");
const middleware = require("./policies/middleware");
const current_weather = require("./mocks/current-weather");
const onecall = require("./mocks/one-call");
const { default: axios } = require("axios");
const coordsByCity = require("./mocks/coords-by-city");
const cityByCoordsOpenweather = require("./mocks/city-by-coords-openweather");
const { schema } = require("./schemas/location");
const { normalize, capitalize } = require("./helpers/helpers");
const ipLocation = require("./mocks/ip-location");
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
const GEOLOCATION_API_URL = process.env.GEOLOCATION_API_URL;
const GEOLOCATION_API_KEY = process.env.GEOLOCATION_API_KEY;
const IP_INFO_TOKEN = process.env.IP_INFO_TOKEN;

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

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
  });
}

/*
This will call the weather api and return the current weather
of the city given in the search params string. Units specifies
if the measurement will be done in metric, imperial or standard.
*/
app.get("/api/current/city", (req, res, next) => {
  const { city, units = "metric" } = req.query;
  axios
    .get(
      `https://${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
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
    city,
  } = req.query;
  axios
    .get(
      `https://${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&lang=${lang}&appid=${API_KEY}`
    )
    .then((response) => {
      res.json({ ...response.data, city });
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
app.get("/api/current/coords-to-city", async (req, res, next) => {
  const { lat, lon, sensor = true, retry = false } = req.query;
  const ip = getIp(req);
  const latlng = [lat, lon].join(",");
  locations.ensureIndex({ geometry: "2dsphere" });
  const found = await getDBRecord({ lat, lon });
  if (found) {
    res.json({
      lat: found.lat,
      lon: found.lon,
      city: found.city,
      localNames: [],
      exists: true,
    });
    incrementCityUpdate(found._id);
  } else {
    axios
      .get(
        `https://${WEATHER_API_GEOCODING}/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        res.json({
          lat: response.data[0].lat,
          lon: response.data[0].lon,
          city: response.data[0].name,
          localNames: response.data[0].local_names,
        });
        updateDB({
          normalizedCity: normalize(response.data[0].name),
          city: response.data[0].name,
          lat: response.data[0].lat,
          lon: response.data[0].lon,
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(response.data[0].lon),
              parseFloat(response.data[0].lat),
            ],
          },
          updates: found ? found.updates : 0,
          ip: found && !!found.ip.length ? [...found.ip] : [],
        });
      })
      .catch((error) => {
        retry
          ? axios
              .get(
                `https://${MAPS_BASE_URL}?latlng=${latlng}&sensor=${sensor}&key=${MAPS_API_KEY}`
              )
              .then((response) => {
                const cityName =
                  response.data.results[0].address_components.find(
                    (component) => component.types.includes("locality")
                  ).long_name;
                res.json({
                  city: cityName,
                  lat: response.data.results[0].geometry.location.lat,
                  lon: response.data.results[0].geometry.location.lon,
                });
                updateDB({
                  normalizedCity: normalize(cityName),
                  city: cityName,
                  lat: response.data.results[0].geometry.location.lat,
                  lon: response.data.results[0].geometry.location.lon,
                  geometry: {
                    type: "Point",
                    coordinates: [
                      parseFloat(
                        response.data.results[0].geometry.location.lon
                      ),
                      parseFloat(
                        response.data.results[0].geometry.location.lat
                      ),
                    ],
                  },
                  updates: found ? found.updates : 0,
                  ip: found && !!found.ip.length ? [...found.ip] : [],
                });
              })
              .catch((error) => {
                next(error);
              })
          : next(error);
      });
  }
});

app.get("/api/current/location", async (req, res, next) => {
  const ip = getIp(req);
  axios
    .get(`https://ipinfo.io/${ip}?token=${IP_INFO_TOKEN}`)
    .then(async (response) => {
      const { data } = response;
      const [lat, lon] = data.loc.split(",");
      const found = await getDBRecord({
        city: data.city,
      });
      res.json({
        ip: data.ip,
        city: data.city,
        region: data.region,
        regionCode: data.region,
        country: data.country,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        postal: data.postal,
        exists: !!found,
      });
      if (found) {
        incrementCityUpdate(found._id);
        updateIpList(found._id, ip);
      } else {
        updateDB({
          normalizedCity: normalize(data.city),
          city: data.city,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          updates: found ? found.updates : 0,
          ip: found && !!found.ip.length ? [...found.ip] : [ip],
        });
      }
    })
    .catch(async (error) => {
      axios
        .get(
          `https://${GEOLOCATION_API_URL}/?api_key=${GEOLOCATION_API_KEY}&ip_address=${ip}`
        )
        .then(async (response) => {
          const { data } = response;
          const found = await getDBRecord({
            city: data.city,
            lat: parseFloat(data.latitude),
            lon: parseFloat(data.longitude),
          });
          res.json({
            ip: data.ip_address,
            city: data.city,
            exists: !!found,
            cityId: data.city_geoname_id,
            region: data.region,
            regionCode: data.region_iso_code,
            country: data.country,
            countryCode: data.country_code,
            continent: data.continent,
            continentCode: data.continent_code,
            lat: data.latitude,
            lon: data.longitude,
            time: data.current_time,
            isVpn: data.security.is_vpn,
            error,
          });
          if (found) {
            incrementCityUpdate(found._id);
            updateIpList(found._id, ip);
          } else {
            updateDB({
              normalizedCity: normalize(data.city),
              city: data.city,
              lat: data.latitude,
              lon: data.longitude,
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(data.longitude),
                  parseFloat(data.latitude),
                ],
              },
              updates: found ? found.updates : 0,
              ip: found && !!found.ip.length ? [...found.ip] : [ip],
            });
          }
        })
        .catch((error) => {
          next(error);
        });
    });
});

/*
This will do the opposite of the above endpoint.
It will return the coords (lat, lon) of the given location
from the query string params
*/
app.get("/api/current/city-to-coords", async (req, res, next) => {
  const { city, countryCode } = req.query;
  const ip = getIp(req);
  let data;
  const found = await getDBRecord({ city });
  if (found) {
    data = {
      lat: found.lat,
      lon: found.lon,
      city: found.city,
      localNames: [],
      found,
      exists: true,
    };
    res.json(data);
    incrementCityUpdate(found._id);
  } else {
    const url = countryCode
      ? encodeURI(
          `https://${WEATHER_API_GEOCODING}/direct?q=${city},${countryCode}&appid=${API_KEY}`
        )
      : encodeURI(
          `https://${WEATHER_API_GEOCODING}/direct?q=${city}&appid=${API_KEY}`
        );
    axios
      .get(url)
      .then((response) => {
        if (!response.data.length) {
          axios
            .get(
              `https://${MAPS_BASE_URL}?address=${capitalize(
                city
              )}&key=${MAPS_API_KEY}`
            )
            .then((response) => {
              const cityName = response.data.results[0].address_components.find(
                (component) => component.types.includes("locality")
              ).long_name;
              data = {
                lat: response.data.results[0].geometry.location.lat,
                lon: response.data.results[0].geometry.location.lng,
                city: cityName,
                localNames: [],
              };
              res.json(data);
              updateDB({
                normalizedCity: normalize(cityName),
                city: cityName,
                lat: response.data.results[0].geometry.location.lat,
                lon: response.data.results[0].geometry.location.lng,
                geometry: {
                  type: "Point",
                  coordinates: [
                    parseFloat(response.data.results[0].geometry.location.lng),
                    parseFloat(response.data.results[0].geometry.location.lat),
                  ],
                },
                updates: found ? found.updates : 0,
                ip: found && !!found.ip.length ? [...found.ip] : [],
              });
            })
            .catch((error) => {
              next(error);
            });
        } else {
          data = {
            lat: response.data[0].lat,
            lon: response.data[0].lon,
            city: response.data[0].name,
            localNames: response.data[0].local_names,
          };
          res.json(data);
          updateDB({
            normalizedCity: normalize(capitalize(response.data[0].name)),
            city: response.data[0].name,
            lat: response.data[0].lat,
            lon: response.data[0].lon,
            geometry: {
              type: "Point",
              coordinates: [
                parseFloat(response.data[0].lon),
                parseFloat(response.data[0].lat),
              ],
            },
            updates: found ? found.updates : 0,
            ip: found && !!found.ip.length ? [...found.ip] : [],
          });
        }
      })
      .catch((error) => {
        next(error);
      });
  }
});

// MOCKS
app.get("/mockapi/current/all", (req, res, next) => {
  try {
    res.json(current_weather);
  } catch (error) {
    next(error);
  }
});

app.get("/mockapi/current/city", async (req, res, next) => {
  const { city } = req.query;
  const result = current_weather.find(
    (item) => item.name.toLowerCase() === city.toLowerCase()
  );
  result ? res.json(result) : next({ message: "error" });
});

app.get("/mockapi/current/coords-to-city", async (req, res, next) => {
  const { lat, lon } = req.query;
  const ip = getIp(req);
  const latlng = [lat, lon].join(",");
  let result;
  try {
    const found = await getDBRecord({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    });
    if (!found) {
      result = cityByCoordsOpenweather.find(
        (item) =>
          Math.abs(parseFloat(item.lat, 3) - parseFloat(lat, 3)) < 0.1 &&
          Math.abs(parseFloat(item.lon, 3) - parseFloat(lon, 3)) < 0.1
      );
      updateDB({
        normalizedCity: normalize(capitalize(result.name)),
        city: result.name,
        lat: result.lat,
        lon: result.lon,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)],
        },
        updates: found ? found.updates : 0,
        ip: found && !!found.ip.length ? [...found.ip] : [],
      });
    } else {
      result = cityByCoordsOpenweather.find(
        (item) =>
          Math.abs(parseFloat(item.lat, 3) - parseFloat(found.lat, 3)) < 0.1 &&
          Math.abs(parseFloat(item.lon, 3) - parseFloat(found.lon, 3)) < 0.1
      );
      incrementCityUpdate(found._id);
    }
    if (result) {
      res.json({ ...result, city: result.name, found });
    } else {
      next({ message: "error" });
    }
  } catch (error) {
    next(error);
  }
});

app.get("/mockapi/current/location", async (req, res, next) => {
  const ip = getIp(req);
  res.json({
    ip: ipLocation.ip_address,
    city: ipLocation.city,
    cityId: ipLocation.city_geoname_id,
    region: ipLocation.region,
    regionCode: ipLocation.region_iso_code,
    country: ipLocation.country,
    countryCode: ipLocation.country_code,
    continent: ipLocation.continent,
    continentCode: ipLocation.continent_code,
    lat: ipLocation.latitude,
    lon: ipLocation.longitude,
    time: ipLocation.current_time,
    isVpn: ipLocation.security.is_vpn,
  });
  const found = await getDBRecord({
    city: ipLocation.city,
  });
  if (found) {
    incrementCityUpdate(found._id);
  } else {
    updateDB({
      normalizedCity: normalize(ipLocation.city),
      city: ipLocation.city,
      lat: ipLocation.latitude,
      lon: ipLocation.longitude,
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(ipLocation.longitude),
          parseFloat(ipLocation.latitude),
        ],
      },
      updates: found ? found.updates : 0,
      ip: found && !!found.ip.length ? [...found.ip] : [ip],
    });
  }
});

app.get("/mockapi/current/city-to-coords", async (req, res, next) => {
  const { city } = req.query;
  const ip = getIp(req);
  const normalizedCity = normalize(capitalize(city));
  let data;
  try {
    const found = await getDBRecord({ city });
    if (!found) {
      const result = coordsByCity.find(
        (item) =>
          item.name.toLowerCase() === city.toLowerCase() ||
          Object.keys(item.local_names).some(
            (key) => item.local_names[key].toLowerCase() === city.toLowerCase()
          )
      );
      data = {
        lat: result.lat,
        lon: result.lon,
        city: result.name,
        localNames: result.local_names,
      };
      updateDB({
        normalizedCity,
        lat: data.lat,
        lon: data.lon,
        city: data.city,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        },
        updates: found ? found.updates : 0,
        ip: found && !!found.ip.length ? [...found.ip] : [],
      });
    } else {
      data = {
        lat: found.lat,
        lon: found.lon,
        city: found.city,
        localNames: {},
      };
      incrementCityUpdate(found._id);
    }
    data ? res.json(data) : next({ message: "error" });
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
    city,
  } = req.query;
  const cityName = city.charAt(0).toUpperCase() + city.toLowerCase().slice(1);
  try {
    res.json({ ...onecall[0], city: cityName });
  } catch (err) {
    next(err);
  }
});

const updateDB = async (data) => {
  if (data.updates >= Number.MAX_SAFE_INTEGER) {
    data.updates = 0;
  }
  try {
    schema
      .validate({ ...data })
      .then(async () => {
        const found = await getDBRecord({ ...data });
        const done = await locations.update(
          found
            ? { _id: found._id }
            : { normalizedCity: normalize(capitalize(data.city)) },
          { ...data },
          { upsert: true }
        );
        console.log(done);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    next(err);
  }
};

const incrementCityUpdate = async (_id) => {
  if (!_id) {
    return;
  }
  const done = await locations.findOneAndUpdate(
    { _id },
    { $inc: { updates: 1 } }
  );
};

const updateIpList = async (_id, ip) => {
  if (!_id) {
    return;
  }
  const done = await locations.update({ _id }, { $addToSet: { ip } });
};

const getIp = (req) => {
  return req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
};

const getDBRecord = async (params) => {
  const query = buildQuery(params);
  locations.ensureIndex({ geometry: "2dsphere" });
  const found = await locations.findOne({
    $or: [...query],
  });
  return found;
};

const buildQuery = (params) => {
  const { city, lat, lon, ip } = params;
  let query = [];
  if (lat && lon) {
    query.push({
      geometry: {
        $near: {
          $geometry: {
            coordinates: [parseFloat(lon), parseFloat(lat)],
            type: "Point",
          },
          $maxDistance: 5000,
        },
      },
    });
    return query;
  }
  if (city) {
    query.push(
      { city },
      { city: capitalize(city) },
      { normalizedCity: normalize(capitalize(city)) },
      { normalizedCity: capitalize(city) }
    );
    return query;
  }
  if (ip) {
    query.push({ ip: { $in: [ip] } });
  }
  return query;
};

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else res.status(500);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
  });
});
