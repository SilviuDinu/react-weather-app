export enum REAL_ENDPOINTS {
    GET_CITY = '/api/current/city',
    GET_LOCATION_BY_COORDS = '/api/current/location',
    GET_WEATHER_BY_COORDS = '/api/current/coords'
}

export enum MOCK_ENDPOINTS {
    GET_ALL = '/mockapi/current/all',
    GET_CITY = '/mockapi/current/city',
    GET_LOCATION_BY_COORDS = '/mockapi/current/location',
    GET_WEATHER_BY_COORDS = '/mockapi/current/coords',
}

export const ENDPOINTS = process.env.NODE_ENV === 'production'
    ? { ...REAL_ENDPOINTS } : { ...MOCK_ENDPOINTS }