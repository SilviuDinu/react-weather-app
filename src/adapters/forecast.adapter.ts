import { FORECAST_TYPES, TEMP_TYPE } from "@enums/forecast-types.enum";
import { Adapter } from "@models/adapter";
import { FeelsLike, Forecast, ForecastInfo, TemperatureInfo, WeatherInfo, WindInfo } from "@models/forecast";
import moment from "moment";

export class ForecastAdapter implements Adapter<Forecast[]> {

    adapt(data: any, type: string): any {
        switch (type) {
            case FORECAST_TYPES.ONE_CALL:
                return this.adaptOneCall(data);
            case FORECAST_TYPES.CURRENT_CITY_WEATHER:
                return this.adaptCurrentCityWeather(data);
        }
    }

    adaptOneCall(data: any): Forecast {
        const { lat, lon, timezone, timezone_offset, cityName } = data || {};
        return new Forecast(
            cityName,
            lat,
            lon,
            timezone,
            this.getCurrentInfo(data) as ForecastInfo,
            timezone_offset,
            this.getHourlyInfo(data) as ForecastInfo[],
            this.getDailyInfo(data) as ForecastInfo[],
        );
    }

    adaptCurrentCityWeather(data: any): Forecast {
        const { main, wind, weather = [], sys } = data || {};
        const { lat, lon, } = data.coord || {};
        return new Forecast(
            data.name,
            lat,
            lon,
            data.timezone,
            new ForecastInfo(
                moment.unix(data.dt),
                new TemperatureInfo(
                    main.temp,
                    main.temp_min,
                    main.temp_max
                ),
                main.feels_like,
                main.pressure,
                main.humidity,
                data.clouds,
                data.visibility,
                new WindInfo(
                    wind.speed,
                    wind.degrees,
                    wind.gust),
                new WeatherInfo(
                    weather[0].id,
                    weather[0].main,
                    weather[0].description,
                    weather[0].icon),
                moment.unix(sys.sunrise).format("HH:mm"),
                moment.unix(sys.sunset).format("HH:mm"),
            )
        );
    }

    getDailyInfo(data: any): any[] {
        const { daily } = data || {};
        if (!daily) {
            return [];
        }
        return !!daily.length
            ? daily.map((item: any) => {
                return new ForecastInfo(
                    moment.unix(item.dt),
                    this.getTemperatureInfo(item.temp, TEMP_TYPE.DAILY),
                    item.feels_like,
                    item.pressure,
                    item.humidity,
                    item.clouds,
                    item.visibility,
                    this.getWindInfo(item),
                    this.getWeatherInfo(item.weather[0]),
                    moment.unix(item.sunrise).format("HH:mm"),
                    moment.unix(item.sunset).format("HH:mm"),
                    this.getRainInfo(item.rain),
                    item.uvi,
                    item.dew_point,
                )
            }) : [];
    }


    getHourlyInfo(data: any): any[] {
        const { hourly } = data || {};
        if (!hourly) {
            return [];
        }
        return !!hourly.length
            ? hourly.map((item: any) => {
                return new ForecastInfo(
                    moment.unix(item.dt),
                    this.getTemperatureInfo(item.temp, TEMP_TYPE.HOURLY),
                    item.feels_like,
                    item.pressure,
                    item.humidity,
                    item.clouds,
                    item.visibility,
                    this.getWindInfo(item),
                    this.getWeatherInfo(item.weather[0]),
                    undefined,
                    undefined,
                    this.getRainInfo(item.rain),
                    item.uvi,
                    item.dew_point,
                )
            }) : [];
    }

    getCurrentInfo(data: any): any {
        const { current } = data || {};
        if (!current) {
            return [];
        }
        return new ForecastInfo(
            moment.unix(current.dt),
            this.getTemperatureInfo(current.temp, TEMP_TYPE.CURRENT, data),
            current.feels_like,
            current.pressure,
            current.humidity,
            current.clouds,
            current.visibility,
            this.getWindInfo(current) || {},
            this.getWeatherInfo(current.weather[0]),
            moment.unix(current.sunrise).format("HH:mm"),
            moment.unix(current.sunset).format("HH:mm"),
            this.getRainInfo(current.rain),
            current.uvi,
            current.dew_point,
        )
    }

    getWindInfo(data: any): WindInfo {
        return new WindInfo(
            data.wind_speed,
            data.wind_deg,
            data.wind_gust
        )
    }

    getWeatherInfo(data: any): WeatherInfo {
        console.log('weather', data)
        return new WeatherInfo(
            data.id,
            data.main,
            data.description,
            data.icon
        );
    }

    getRainInfo(data: any) {
        // TODO: change this in the future
        return null;
    }

    getTemperatureInfo(temp: any, type: TEMP_TYPE, data?: any): any {
        if (!temp) {
            return {};
        }
        let min, max;
        const isObj = temp instanceof Object;
        if (!isObj) {
            [min, max] = type === TEMP_TYPE.CURRENT
                ? this.getMinMaxTemps(data)
                : [undefined, undefined];

            return new TemperatureInfo(
                temp,
                min,
                max
            );
        }
        return new TemperatureInfo(
            undefined,
            temp.min,
            temp.max,
            temp.day,
            temp.night,
            temp.eve,
            temp.morn
        );
    }

    getMinMaxTemps(allData: any) {
        const data = allData;
        if (data.daily) {
            const current = moment.unix(data.current.dt);
            const foundDay = data.daily.find((day: any) => current.diff(moment.unix(day.dt), 'days') === 0);
            return foundDay ? [foundDay.temp.min, foundDay.temp.max] : [undefined, undefined];
        }
        if (data.hourly) {
            const current = moment.unix(data.current.dt);
            const todayHours = data.hourly.filter((hour: any) => current.diff(hour.dt, 'days') === 0);
            return [
                Math.min(...todayHours.map((o: any) => o.temp), 0),
                Math.max(...todayHours.map((o: any) => o.temp), 0)
            ]
        }
        return [undefined, undefined];
    }
}