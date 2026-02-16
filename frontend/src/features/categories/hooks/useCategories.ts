import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api";
import { queryKeys } from "@/lib/queryKeys";

export const useCategories = (userId?: string) => {
    return useQuery({
        queryKey: userId ? queryKeys.categories(userId) : [],
        queryFn: () => fetchCategories(userId!),
        enabled: !!userId,
        select: (data) => data.data, // 👈 IMPORTANT
    });
};

