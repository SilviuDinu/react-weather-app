import { Coords } from '@models/coords';

export const buildSearchParams = (params: any) => {
    return encodeURI(`?${Object.keys(params)
        .map((key: string) => `${key}=${params[key]}`)
        .join('&')}`);
}

export const getObjIndexFromArray = (haystack: any[], needle: any): number => {
    return haystack.indexOf(
        haystack.find(
            (hay: any) => {
                const hayCity = hay.city;
                const needleCity = needle.city;
                return normalize(hayCity).toLowerCase() === normalize(needleCity).toLowerCase();
            }
        )
    );
}

export const capitalize = (str: string) => {
    return str.split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const exists = (pool: any[], fish: any): boolean => {
    const index = getObjIndexFromArray(pool, fish);
    if (index > -1) {
        return true;
    }
    return false;
}

export const areCoordsInArray = (arr: any[], coords: Coords): boolean => {
    const { lat, lon } = coords;
    if (!lat || !lon) {
        return false;
    }
    const parsedLat = parseFloat((lat as number).toFixed(3));
    const parsedLon = parseFloat((lon as number).toFixed(3));
    return arr.some((item: any) => (
        isCloseEnough(item.lat, parsedLat) && isCloseEnough(item.lon, parsedLon)
    ));
}

export const isCloseEnough = (reference: any, value: any, treshold = 0.05): boolean => {
    return Math.abs(parseFloat(reference.toFixed(3))) - value < treshold;
}

export const getLoadingId = (data: any[], value: any): number => {
    const idx = getObjIndexFromArray(data, { city: value });
    if ((!idx && idx !== 0) || idx < 0) {
        return data.length;
    }
    return idx;
}

export const normalize = (data: string): string => {
    return data.normalize('NFD').replace(/\p{Diacritic}/gu, "");
}