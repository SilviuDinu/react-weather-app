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
});

module.exports = { schema };

// const schema = new Schema({
//   normalizedCity: {
//     type: String,
//     required: [true, 'normalizedCity is required']
//   },
//   city: {
//     type: String,
//     required: [true, 'city is required']
//   },
//   lat: {
//     type: Number,
//     required: [true, 'lat is required']
//   },
//   lon: {
//     type: Number,
//     required: [true, 'lon is required']
//   },
//   coordinates: {
//     type: Array,
//     required: [true, 'normalizedCity is required']
//   }
// });
