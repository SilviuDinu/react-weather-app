import { Moment } from "moment";

export class Forecast {
    constructor(
        public city: string,
        public lat: number,
        public lon: number,
        public timezone: string,
        public currentInfo: ForecastInfo,
        public timezoneOffset?: number,
        public hourlyInfo?: ForecastInfo[],
        public dailyInfo?: ForecastInfo[],
    ) { }
}

export class ForecastInfo {
    constructor(
        public timeOfRequest: Moment,
        public temperature: any,
        public feelsLike: FeelsLike,
        public pressure: number,
        public humidity: number,
        public clouds: any,
        public visibility: number,
        public wind: WindInfo,
        public weather: WeatherInfo,
        public sunrise?: Moment,
        public sunset?: Moment,
        public rain?: any,
        public uvIndex?: number,
        public dewPoint?: number,
        public ppChance?: number
    ) { }
}

export class WindInfo {
    constructor(
        public speed?: number,
        public degrees?: number,
        public gust?: number
    ) { }
}

export class FeelsLike {
    constructor(
        public temp?: number,
        public day?: number,
        public night?: number,
        public evening?: number,
        public morning?: number
    ) { }
}

export class WeatherInfo {
    constructor(
        public id: number,
        public mainStatus: string,
        public description: string,
        public icon: string
    ) { }
}


export class TemperatureInfo {
    constructor(
        public value?: number | null,
        public min?: number,
        public max?: number,
        public day?: number,
        public night?: number,
        public evening?: number,
        public morning?: number,
    ) { }
}