exports.normalize = (data) => {
    return data.normalize('NFD').replace(/\p{Diacritic}/gu, "");
}