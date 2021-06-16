import { Moment } from "moment";
import { Weather } from './weather';

export interface CurrentCityWeather {
    coord: Coordinates,
    weather: Weather[],
    base: string,
    main: MainInfo,
    visibility: number,
    wind: Wind,
    clouds: { all: number },
    dt: Moment,
    sys: {
        type: 2,
        id: number,
        country: string,
        sunrise: Moment,
        sunset: Moment
    },
    timezone: number,
    id: number,
    name: string,
    cod: number,
}

export interface Wind {
    speed: number,
    deg: number,
    gust: number
}

export interface Coordinates {
    lon: number,
    lat: number
}

export interface MainInfo {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number
}