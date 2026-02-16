import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    createTag,
    removeTag,
    deleteTagGlobal,
} from "../api";
import { queryKeys } from "@/lib/queryKeys";

export const useTagMutations = (userId: string) => {
    const queryClient = useQueryClient();

    // ✅ Add Tag To Blog
    const addTag = useMutation({
        mutationFn: ({
            blogId,
            tagName,
        }: {
            blogId: string;
            tagName: string;
        }) => createTag(userId, blogId, tagName),

        onSuccess: () => {
            toast.success("Tag added");
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },
    });

    // ✅ Remove Tag From Blog
    const removeTagFromBlog = useMutation({
        mutationFn: ({
            tagId,
            blogId,
        }: {
            tagId: string;
            blogId: string;
        }) => removeTag(tagId, blogId),

        onSuccess: () => {
            toast.success("Tag removed");
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },
    });

    // ✅ Delete Tag Globally
    const deleteTag = useMutation({
        mutationFn: deleteTagGlobal,

        onSuccess: () => {
            toast.success("Tag deleted");

            queryClient.invalidateQueries({
                queryKey: queryKeys.tags(userId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ||
                "Cannot delete tag while it is used by blogs"
            );
        },
    });

    return {
        addTag,
        removeTagFromBlog,
        deleteTag,
    };
};
