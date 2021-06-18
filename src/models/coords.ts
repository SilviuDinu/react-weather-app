export class Coords {
    constructor(
        public lat: number | null,
        public lon: number | null,
        public loading: boolean,
        public error: boolean) { }
}