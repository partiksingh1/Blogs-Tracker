import { fetchAllBlogs, GetCategories } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { GetTags } from "@/api/api";

export const useCategories = (userId?: string, token?: string) => {
    console.log("token issss", token);

    return useQuery({
        queryKey: ["getCategory", userId],
        queryFn: () => GetCategories(userId as string, token as string),
        enabled: !!userId,
        select: (res) => res?.data || []
    })
}
export const useBlogs = (userId?: string, token?: string) => {
    return useQuery({
        queryKey: ["getBlogs", userId],
        queryFn: () => fetchAllBlogs(userId as string, token as string),
        enabled: !!userId,
        select: (res) => res.data
    })
}
export const useTags = (userId?: string, token?: string) => {
    return useQuery({
        queryKey: ["getTags", userId],
        queryFn: () => GetTags(userId as string, token as string),
        enabled: !!userId,
        select: (res) => res || []
    })
}