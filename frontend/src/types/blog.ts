export interface Blog{
    id:number,
    title:string | null,
    url:string,
    isRead:boolean,
    createdAt:Date
    categories:{
        id:number,
        name:string
    }[]
    tags:Tag[]
}
export interface Tag{
    id:number,
    name:string
}