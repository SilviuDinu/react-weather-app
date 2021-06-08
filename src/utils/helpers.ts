export const buildSearchParams = (params: any) => {
    return Object.keys(params)
        .map((key: any, idx: number) =>
            idx === 0 ? `?${key}=${params[key]}` : `&${key}=${params[key]}`
        ).join('');
}