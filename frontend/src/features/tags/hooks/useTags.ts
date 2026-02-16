import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "../api";
import { queryKeys } from "@/lib/queryKeys";

export const useTags = (userId?: string) => {
    return useQuery({
        queryKey: userId ? queryKeys.tags(userId) : [],
        queryFn: () => fetchTags(userId!),
        enabled: !!userId,
    });
};
