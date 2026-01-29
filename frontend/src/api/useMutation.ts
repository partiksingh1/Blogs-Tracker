import { DeleteBlog, DeleteCategories, PostBlog, PostCategories, PostTag, RemoveTag, Summarize, UpdateBlog, UpdateCategory } from "@/api/api";
import { useStateContext } from "@/lib/ContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCategoryMutations = (userId?: string) => {
    const queryClient = useQueryClient();
    const { token } = useStateContext();
    const addCategory = useMutation({
        mutationFn: (newCategory: string) => PostCategories(userId as string, newCategory, token as string),
        onSuccess: () => {
            toast.success("Category added successfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId]
            })
            // setNewCategory("")
            // setShowAddCategoryModal(false)
        }
    })
    const addBlogMutation = useMutation({
        mutationFn: ({ url, title, isRead, categoryName }: { url: string, title: string, isRead: boolean, categoryName: string }) => PostBlog(url, title, isRead, categoryName, userId as string, token as string),
        onSuccess: () => {
            toast.success("Blog added successfully")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId]
            })
        }
    })
    const updateBlogMutation = useMutation({
        mutationFn: ({ status, blogId }: { status: boolean, blogId: string }) => UpdateBlog(status, blogId, token as string),
        onSuccess: () => {
            toast.success("Status updated")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId]
            })
        }
    })
    const deleteBlogMutation = useMutation({
        mutationFn: (blogId: string) => DeleteBlog(blogId, token as string),
        onSuccess: () => {
            toast.success("Blog Deleted");
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId],
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (categoryId: string) => DeleteCategories(categoryId as string, token as string),
        onSuccess: () => {
            toast.success("Category Deleted successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId],
                exact: false
            })
        }
    })
    const updateMutation = useMutation({
        mutationFn: ({ categoryId, categoryName }: { categoryId: string, categoryName: string }) => UpdateCategory(categoryId, categoryName, token as string),
        onSuccess: () => {
            toast.success("Category Updated successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getCategory", userId],
                exact: false
            })
        }
    })
    const addTagMutation = useMutation({
        mutationFn: ({ newTag, blogId }: { newTag: string, blogId: string }) => PostTag(newTag, String(userId), blogId, token as string),
        onSuccess: () => {
            toast.success("Tag added successsfully")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId],
                exact: false
            })
        }
    })
    const deleteTagMutation = useMutation({
        mutationFn: ({ tagId, blogId }: { tagId: string, blogId: string }) => RemoveTag(tagId, blogId, token as string),
        onSuccess: () => {
            toast.success("Tag removed successfully")
            queryClient.invalidateQueries({
                queryKey: ["getBlogs", userId],
                exact: false
            })
        }
    })

    const sumamryMutation = useMutation({
        mutationFn: (url: string) => Summarize(url, token as string),
        onSuccess: () => {
            toast.success("Here is the summary!")
        }
    })
    return { addCategory, deleteCategory: deleteMutation.mutate, updateMutation, addTagMutation, deleteTagMutation, addBlogMutation, deleteBlogMutation, updateBlogMutation, sumamryMutation }
}