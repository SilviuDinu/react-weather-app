import { MOCK_ENDPOINTS } from '@enums/endpoints.enum';

export const buildSearchParams = (params: any) => {
    return encodeURI(`?${Object.keys(params)
        .map((key: string) => `${key}=${params[key]}`)
        .join('&')}`);
}

export const getWeatherByCity = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(MOCK_ENDPOINTS.GET_CITY + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};

export const getLocationByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(MOCK_ENDPOINTS.GET_LOCATION_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
};

export const getWeatherByCoords = (params: any): Promise<any> => {
    const query = buildSearchParams(params);
    return fetch(MOCK_ENDPOINTS.GET_WEATHER_BY_COORDS + query, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
};

export const getObjIndexFromArray = (haystack: any[], needle: any): number => {
    return haystack.indexOf(
        haystack.find(
            (hay: any) => hay.name.toLowerCase() === needle.name.toLowerCase()
        )
    );
}
export const capitalize = (str: string) => {
    return str.split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}