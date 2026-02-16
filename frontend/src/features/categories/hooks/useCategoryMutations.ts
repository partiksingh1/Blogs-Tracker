import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    createCategory,
    deleteCategory,
    updateCategory,
    addCategoryToBlog,
} from "../api";
import { queryKeys } from "@/lib/queryKeys";

export const useCategoryMutations = (userId: string) => {
    const queryClient = useQueryClient();

    // ✅ Create Category
    const addCategory = useMutation({
        mutationFn: ({
            name,
        }: {
            name: string;
        }) => createCategory(userId, name),

        onSuccess: () => {
            toast.success("Category added");
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories(userId),
            });
        },
    });

    // ✅ Delete Category
    const removeCategory = useMutation({
        mutationFn: deleteCategory,

        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories(userId),
            });
        },
    });

    // ✅ Update Category
    const updateCategoryMutation = useMutation({
        mutationFn: ({
            categoryId,
            name,
        }: {
            categoryId: string;
            name: string;
        }) => updateCategory(categoryId, name),

        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories(userId),
            });
        },
    });

    // ✅ Assign Category To Blog
    const assignCategoryToBlog = useMutation({
        mutationFn: ({
            blogId,
            name,
        }: {
            blogId: string;
            name: string;
        }) => addCategoryToBlog(blogId, userId, name),

        onSuccess: () => {
            toast.success("Category assigned to blog");

            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs(userId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.categories(userId),
            });
        },
    });

    return {
        addCategory,
        removeCategory,
        updateCategoryMutation,
        assignCategoryToBlog,
    };
};
