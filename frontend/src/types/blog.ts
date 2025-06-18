export interface Blog{
    id:string,
    title:string | null,
    url:string,
    isRead:boolean,
    createdAt:Date
    categories:{
        id:string,
        name:string
    }[]
    tags:Tag[]
}
export interface Tag{
    id:string,
    name:string
}