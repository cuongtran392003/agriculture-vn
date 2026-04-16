

export class ResponseDto<T>{
    statusCode: number;
    message: string; 
    data?:T;
    meta?:{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }

    constructor(statusCode:number, message:string, data?:T, meta?:{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
}