import { Moment } from "moment";
import { gunzip } from 'zlib';
import { Weather } from './weather';

export class OneCallWeather {
    constructor(
        public lat: number,
        public lon: number,
        public timezone: string,
        public timezone_offset: number,
        public current: HourlyForecast,
        public hourly?: HourlyForecast[],
        public daily?: DailyForecast[],
        public minutely?: any[],
    ) { }
}

export class HourlyForecast {
    constructor(
        public dt: Moment,
        public temp: number,
        public feels_like: number,
        public pressure: number,
        public humidity: number,
        public dew_point: number,
        public uvi: number,
        public clouds: number,
        public visibility: number,
        public wind_speed: number,
        public wind_deg: number,
        public wind_gust: number,
        public weather: Weather[],
        public rain: any,
        public sunrise?: number,
        public sunset?: number,
    ) { }
}

export class DailyForecast extends HourlyForecast {
    constructor(
        moonrise: 1623559260,
        moonset: 1623617280,
        moon_phase: 0.09,
        feels_like: { day: 18.94, night: 11.66, eve: 18.41, morn: 14.87 },
        pressure: 1010,
        humidity: 91,
        dew_point: 17.14,
        wind_speed: 5.41,
        wind_deg: 266,
        wind_gust: 7.93,
        weather: [
            { id: 501, main: "Rain", description: "moderate rain", icon: "10d" },
        ],
        clouds: 100,
        pop: 1,
        rain: 4.62,
        uvi: 2.98,
    ) { super(dt, temp, feels_like, pressure, humidity, dew_point, uvi, clouds, visibility, wind_speed, wind_deg, wind_gust, weather, rain, sunrise, sunset); }
}

