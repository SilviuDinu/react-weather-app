import { FORECAST_TYPES } from "@enums/forecast-types.enum";
import { Adapter } from "@models/adapter";
import { Forecast, ForecastInfo, TemperatureInfo, WeatherInfo, WindInfo } from "@models/forecast";
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
        const { lat, lon, timezone, timezone_offset, current = {}, hourly = [], daily = [] } = data || {};
        return new Forecast(
            'random',
            lat,
            lon,
            timezone,
            this.getCurrentInfo(current) as ForecastInfo,
            timezone_offset,
            this.getHourlyInfo(hourly) as ForecastInfo[],
            this.getDailyInfo(daily) as ForecastInfo[],
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
        return !!data.length
            ? data.map((item: any) => {
                return new ForecastInfo(
                    moment.unix(item.dt),
                    this.getTemperatureInfo(item.temp),
                    item.feels_like,
                    item.pressure,
                    item.humidity,
                    item.clouds,
                    item.visibility,
                    this.getWindInfo(item),
                    this.getWeatherInfo(item.weather),
                    moment.unix(item.sunrise).format("HH:mm"),
                    moment.unix(item.sunset).format("HH:mm"),
                    this.getRainInfo(item.rain),
                    item.uvi,
                    item.dew_point,
                )
            }) : [];
    }


    getHourlyInfo(data: any): any[] {
        return !!data.length
            ? data.map((item: any) => {
                return new ForecastInfo(
                    moment.unix(item.dt),
                    this.getTemperatureInfo(item.temp),
                    item.feels_like,
                    item.pressure,
                    item.humidity,
                    item.clouds,
                    item.visibility,
                    this.getWindInfo(item),
                    this.getWeatherInfo(item.weather),
                    moment.unix(item.sunrise).format("HH:mm"),
                    moment.unix(item.sunset).format("HH:mm"),
                    this.getRainInfo(item.rain),
                    item.uvi,
                    item.dew_point,
                )
            }) : [];
    }

    getCurrentInfo(data: any): any {
        return new ForecastInfo(
            moment.unix(data.dt),
            this.getTemperatureInfo(data),
            data.feels_like,
            data.pressure,
            data.humidity,
            data.clouds,
            data.visibility,
            this.getWindInfo(data),
            this.getWeatherInfo(data.weather),
            moment.unix(data.sunrise).format("HH:mm"),
            moment.unix(data.sunset).format("HH:mm"),
            this.getRainInfo(data.rain),
            data.uvi,
            data.dew_point,
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

    getTemperatureInfo(data: any): any {
        let min, max;
        const { current } = data || {};
        if (!(current.temp instanceof Object)) {
            [min, max] = this.getMinMaxTemps(data);
        }
        return new TemperatureInfo(
            data.current || null,
            data.min || min,
            data.max || max,
            data.day,
            data.night,
            data.eve
        )
    }

    getMinMaxTemps(data: any) {
        if (data.daily) {
            const current = moment.unix(data.current.dt);
            const foundDay = data.daily.find((day: any) => current.diff(day.dt, 'days') === 0);
            return [foundDay.temp.min, foundDay.temp.max];
        }
        if (data.hourly) {
            return [
                Math.min(...data.hourly.map((o: any) => o.temp), 0),
                Math.max(...data.hourly.map((o: any) => o.temp), 0)
            ]
        }
        return [undefined, undefined];
    }
}