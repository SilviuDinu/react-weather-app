export enum REAL_ENDPOINTS {
    GET_CITY = '/api/current/city',
    GET_LOCATION_BY_COORDS = '/api/current/coords-to-city',
    GET_WEATHER_BY_COORDS = '/api/current/coords',
    GET_ONE_CALL_BY_COORDS = '/api/one/coords',
    GET_COORDS_BY_CITY = '/api/current/city-to-coords',
}

export enum MOCK_ENDPOINTS {
    GET_ALL = '/mockapi/current/all',
    GET_CITY = '/mockapi/current/city',
    GET_LOCATION_BY_COORDS = '/mockapi/current/coords-to-city',
    GET_COORDS_BY_CITY = '/mockapi/current/city-to-coords',
    GET_WEATHER_BY_COORDS = '/mockapi/current/coords',
    GET_ONE_CALL_BY_COORDS = '/mockapi/one/coords',
}

export const ENDPOINTS = process.env.NODE_ENV === 'production'
    ? { ...REAL_ENDPOINTS } : { ...MOCK_ENDPOINTS }