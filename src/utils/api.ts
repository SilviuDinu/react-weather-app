import { ForecastAdapter } from '@adapters/forecast.adapter';
import { ENDPOINTS } from '@enums/endpoints.enum';
import { FORECAST_TYPES } from '@enums/forecast-types.enum';
import { buildSearchParams } from './helpers';

export default class Api {

    private forecastAdapter: ForecastAdapter = new ForecastAdapter();

    constructor() { }

    getWeatherByCity = (params: any): Promise<any> => {
        const query = buildSearchParams(params);
        const promise = fetch(ENDPOINTS.GET_CITY + query, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return promise
            .then((response: any) => {
                return response.json().then((json: any) => {
                    return response.ok ?
                        this.forecastAdapter.adapt(json, FORECAST_TYPES.CURRENT_CITY_WEATHER) :
                        Promise.reject(json);
                })
            })

    };

    getLocationByCoords = async (params: any): Promise<any> => {
        const query = buildSearchParams(params);
        const promise = fetch(ENDPOINTS.GET_LOCATION_BY_COORDS + query, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
        return promise
            .then((response: any) => {
                return response.json().then((json: any) => {
                    return response.ok ?
                        json :
                        Promise.reject(json);
                })
            })
    };

    getWeatherByCoords = async (params: any): Promise<any> => {
        const query = buildSearchParams(params);
        const promise = fetch(ENDPOINTS.GET_WEATHER_BY_COORDS + query, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return promise
            .then((response: any) => {
                return response.json().then((json: any) => {
                    return response.ok ?
                        this.forecastAdapter.adapt(json, FORECAST_TYPES.CURRENT_CITY_WEATHER) :
                        Promise.reject(json);
                })
            })
    };

    getAllWeatherByCoords = async (params: any): Promise<any> => {
        const query = buildSearchParams(params);
        const promise = fetch(ENDPOINTS.GET_ONE_CALL_BY_COORDS + query, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        return promise
            .then((response: any) => {
                return response.json().then((json: any) => {
                    return response.ok ?
                        this.forecastAdapter.adapt(json, FORECAST_TYPES.ONE_CALL) :
                        Promise.reject(json);
                })
            })
    };

    getCoordsByCity = async (cityName: string): Promise<any> => {
        const promise = fetch(ENDPOINTS.GET_COORDS_BY_CITY + `?cityName=${cityName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        return promise
            .then((response: any) => {
                return response.json().then((json: any) => {
                    return response.ok ?
                        { ...json } :
                        Promise.reject(json);
                })
            })
    }
}
