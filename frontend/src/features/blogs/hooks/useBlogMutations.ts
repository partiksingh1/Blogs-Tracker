import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postBlog, deleteBlog, updateBlogStatus, summarizeBlog } from "../api";
import { queryKeys } from "@/lib/queryKeys";

export const useBlogMutations = (userId: string) => {
    const queryClient = useQueryClient();

    const addBlog = useMutation({
        mutationFn: postBlog,
        onSuccess: () => {
            toast.success("Blog added");
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },
    });

    const removeBlog = useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            toast.success("Blog deleted");
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },
    });

    const updateStatus = useMutation({
        mutationFn: ({ blogId, status }: { blogId: string; status: boolean }) =>
            updateBlogStatus(blogId, status),
        onSuccess: () => {
            toast.success("Status updated");
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });
        },
    });

    /* ✅ ADD THIS */
    const summarize = useMutation({
        mutationFn: summarizeBlog,
        onError: () => {
            toast.error("Failed to generate summary");
        },
    });

    return { addBlog, removeBlog, updateStatus, summarize };
};

