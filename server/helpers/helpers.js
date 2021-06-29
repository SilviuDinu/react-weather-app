exports.normalize = (data) => {
  return data.normalize("NFD").replace(/\p{Diacritic}/gu, "");
};

exports.capitalize = (str) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
