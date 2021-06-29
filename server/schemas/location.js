const { Schema } = require("mongoose");
const yup = require("yup");

const schema = yup.object().shape({
  normalizedCity: yup.string().required(),
  city: yup.string().required(),
  lat: yup.number().required(),
  lon: yup.number().required(),
  geometry: yup.object().shape({
    type: yup.string().required(),
    coordinates: yup.array().required(),
  }),
  updates: yup.number().required()
});

module.exports = { schema };
