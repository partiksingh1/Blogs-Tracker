import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchAllBlogs } from "../api";

export const useBlogs = (userId?: string) => {
    return useQuery({
        queryKey: userId ? queryKeys.blogs(userId) : [],
        queryFn: () => fetchAllBlogs(userId!),
        enabled: !!userId,
        select: (data) => data.data,
    });
};
