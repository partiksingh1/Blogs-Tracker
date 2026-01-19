import { fetchAllBlogs, GetCategories } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (userId?: string) => {
    return useQuery({
        queryKey: ["getCategory", userId],
        queryFn: () => GetCategories(userId as string),
        enabled: !!userId,
        select: (res) => res?.data || []
    })
}
export const useBlogs = (userId?: string) => {
    return useQuery({
        queryKey: ["getBlogs", userId],
        queryFn: () => fetchAllBlogs(userId as string),
        enabled: !!userId,
        select: (res) => res.data
    })
}