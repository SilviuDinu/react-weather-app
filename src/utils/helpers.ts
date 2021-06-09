export const buildSearchParams = (params: any) => {
    return encodeURI(`?${Object.keys(params)
        .map((key: string) => `${key}=${params[key]}`)
        .join('&')}`);
}