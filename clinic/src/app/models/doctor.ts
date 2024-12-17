export class doctor{
    static append(arg0: string, selectedPicture: File, name: string) {
      throw new Error('Method not implemented.');
    }
   
    constructor(public id?:number,
        public firstName?:string,
        public lastName?:string,
        public email?:string,
        public person_id?:string,
        public password?:string,
        public picture?:File,
        public cv?:File,
        public category_id?:number,
        public category_name?:string,
        public doctor_review?:number
    ){}
}