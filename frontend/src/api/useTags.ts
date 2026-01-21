import { GetTags } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useTags = (userId?: string) => {
    return useQuery({
        queryKey: ["getTags", userId],
        queryFn: () => GetTags(userId as string),
        enabled: !!userId,
        select: (res) => res || []
    })
}