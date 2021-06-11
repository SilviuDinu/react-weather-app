export const buildSearchParams = (params: any) => {
    return encodeURI(`?${Object.keys(params)
        .map((key: string) => `${key}=${params[key]}`)
        .join('&')}`);
}

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