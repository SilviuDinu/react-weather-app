import { ForecastAdapter } from '@adapters/forecast.adapter';
import { ENDPOINTS } from '@enums/endpoints.enum';
import { FORECAST_TYPES } from '@enums/forecast-types.enum';
import { buildSearchParams } from './helpers';

const forecastAdapter = new ForecastAdapter();

export const getWeatherByCity = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    const promise = fetch(ENDPOINTS.GET_CITY + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return promise
        .then((response: any) => response.json())
        .then((response: any) => {
           const cucu =  forecastAdapter.adapt(response, FORECAST_TYPES.CURRENT_CITY_WEATHER)
           console.log(cucu)
           return cucu
        })
        .catch((err: any) => err)
};

export const getLocationByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    const promise = fetch(ENDPOINTS.GET_LOCATION_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    return promise
        .then((response: any) => response.json())
        .then((response: any) => response)
        .catch((err: any) => err)
};

export const getWeatherByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    const promise = fetch(ENDPOINTS.GET_WEATHER_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return promise
        .then((response: any) => response.json())
        .then((response: any) => forecastAdapter.adapt(response, FORECAST_TYPES.CURRENT_CITY_WEATHER))
        .catch((err: any) => err)
};

export const getAllWeatherByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    const promise = fetch(ENDPOINTS.GET_ONE_CALL_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return promise
        .then((response: any) => response.json())
        .then((response: any) => forecastAdapter.adapt(response, FORECAST_TYPES.ONE_CALL))
        .catch((err: any) => err)
};

export const getCoordsByCity = (cityName: string): Promise<any> => {
    const promise = fetch(ENDPOINTS.GET_ONE_CALL_BY_COORDS + `?cityName=${cityName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return promise
        .then((response: any) => response.json())
        .then((response: any) => {
            return { lat: response.lat, lon: response.lon }
        })
        .catch((err: any) => err)
}
