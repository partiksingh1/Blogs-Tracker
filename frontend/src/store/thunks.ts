import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
interface CreateBlogRequest {
    url: string
    title: string
    isRead?: boolean
    categoryName: string
}

interface CreateCategoryRequest {
    categoryName: string
}

interface UpdateBlogStatusRequest {
    blogId: string
    status: boolean
}

interface AddTagRequest {
    blogId: string
    tagName: string
}

interface DeleteTagRequest {
    blogId: string
    tagName: string
}
// Fetch all blogs for user
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (_, { getState, rejectWithValue }) => {
        console.log("4) fetch blog thunk called ");
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/blogs/${userId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            return response.data.blogs || []
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to fetch blogs'
            )
        }
    }
)
// Create a new blog
export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (blogData: CreateBlogRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/blog`,
                {
                    ...blogData,
                    userId: userId,
                }, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            return response.data.blogs || []
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to fetch blogs'
            )
        }
    }
)

// Update blog read status
export const updateBlogStatus = createAsyncThunk(
    'blogs/updateBlogStatus',
    async ({ blogId, status }: UpdateBlogStatusRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/blog/${blogId}`,
                {
                    status: status,
                    userId: userId,
                }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            return response.data.blogStatus
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to update blog status'
            )
        }
    }
)

// Delete blog
export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (blogId: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/blog/${blogId}`,
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            )
            return blogId
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to delete blog'
            )
        }
    }
)

// Fetch categories
export const fetchCategories = createAsyncThunk(
    'blogs/fetchCategories',
    async (_, { getState, rejectWithValue }) => {
        console.log("3) fetch categories thunk called ");

        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/category/${userId}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    }
                }
            )
            return response.data.categories || []
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to fetch categories'
            )
        }
    }
)

// Create category
export const createCategory = createAsyncThunk(
    'blogs/createCategory',
    async ({ categoryName }: CreateCategoryRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/category`,
                { userId, categoryName },
                {
                    headers: {
                        Authorization: `${token}`,
                    }
                }
            )

            return response.data.category
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to create category'
            )
        }
    }
)

// Delete category => todo
export const deleteCategory = createAsyncThunk(
    'blogs/deleteCategory',
    async (categoryName: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/category`,
                {
                    headers: {
                        Authorization: `${token}`
                    },
                    data: { userId, categoryName }
                }
            )

            return { categoryName, deletedCategory: response.data.category }
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to delete category'
            )
        }
    }
)

// TAGS thunks

// Add tag to blog
export const addTagToBlog = createAsyncThunk(
    'blogs/addTagToBlog',
    async ({ blogId, tagName }: AddTagRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/blog/tag`,
                { blogId, userId, tagName },
                {
                    headers: {
                        Authorization: `${token}`,
                    }
                }
            )
            return {
                blogId,
                blog: response.data.blog,
                tag: response.data.tag
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to add tag to blog'
            )
        }
    }
)

// Remove tag from blog
export const removeTagFromBlog = createAsyncThunk(
    'blogs/removeTagFromBlog',
    async ({ blogId, tagName }: DeleteTagRequest, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: { token: string, userId: string } }
            const token = state.auth.token
            const userId = state.auth.userId
            await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/delete/tag`,
                {
                    headers: {
                        Authorization: `${token}`
                    },
                    data: { blogId, userId, tagName }
                }
            )

            return { blogId, tagName }
        } catch (error) {
            console.error(error);
            return rejectWithValue(
                'Failed to remove tag from blog'
            )
        }
    }
)