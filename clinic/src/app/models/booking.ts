export class booking{
    static booking_date: any;
    constructor(
        public userid?:number,
        public doctorid?:number,
        public booking_date?:Date,
        public description?:string,
    ){}
}