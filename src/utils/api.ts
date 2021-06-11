import { ENDPOINTS } from '@enums/endpoints.enum';
import { buildSearchParams } from './helpers';

export const getWeatherByCity = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(ENDPOINTS.GET_CITY + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};

export const getLocationByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(ENDPOINTS.GET_LOCATION_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
};

export const getWeatherByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(ENDPOINTS.GET_WEATHER_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};
