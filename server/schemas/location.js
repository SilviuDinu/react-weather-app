const yup = require("yup");

const schema = yup.object().shape({
  city: yup.string().required(),
  lat: yup.number().required(),
  lon: yup.number().required(),
});

module.exports = { schema };
