export interface Adapter<T> {
    adapt(item: any, ...params: any): T;
}