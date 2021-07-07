exports.normalize = (data) => {
  if (!data) {
    return;
  }
  return data.normalize("NFD").replace(/\p{Diacritic}/gu, "");
};

exports.capitalize = (str) => {
  if (!str) {
    return;
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
