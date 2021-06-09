import { ENDPOINTS } from '@enums/endpoints.enum';

export const buildSearchParams = (params: any) => {
    return encodeURI(`?${Object.keys(params)
        .map((key: string) => `${key}=${params[key]}`)
        .join('&')}`);
}

export const getWeatherByCity = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(ENDPOINTS.MOCK_GET_CITY + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};

export const getLocationByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(ENDPOINTS.MOCK_HET_LOCATION_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};