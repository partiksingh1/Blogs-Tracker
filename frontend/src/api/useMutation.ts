import { DeleteCategories, PostCategories, PostTag, RemoveTag, UpdateCategory } from "@/api/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCategoryMutations = (userId?: string) => {
    const queryClient = useQueryClient();
    const addCategory = useMutation({
        mutationFn: (newCategory: string) => PostCategories(userId as string, newCategory),
        onSuccess: () => {
            toast.success("Category added successfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId]
            })
            // setNewCategory("")
            // setShowAddCategoryModal(false)
        }
    })
    const deleteMutation = useMutation({
        mutationFn: (categoryId: string) => DeleteCategories(categoryId as string),
        onSuccess: () => {
            toast.success("Category Deleted successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId],
                exact: false
            })
        }
    })
    const updateMutation = useMutation({
        mutationFn: ({ categoryId, categoryName }: { categoryId: string, categoryName: string }) => UpdateCategory(categoryId, categoryName),
        onSuccess: () => {
            toast.success("Category Updated successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId],
                exact: false
            })
        }
    })
    const addTagMutation = useMutation({
        mutationFn: ({ newTag, blogId }: { newTag: string, blogId: string }) => PostTag(newTag, String(userId), blogId),
        onSuccess: () => {
            toast.success("Tag added successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId],
                exact: false
            })
        }
    })
    const deleteTagMutation = useMutation({
        mutationFn: ({ tagId, blogId }: { tagId: string, blogId: string }) => RemoveTag(tagId, blogId),
        onSuccess: () => {
            toast.success("Tag removed successfully")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId],
                exact: false
            })
        }
    })
    return { addCategory, deleteCategory: deleteMutation.mutate, updateMutation, addTagMutation, deleteTagMutation }
}