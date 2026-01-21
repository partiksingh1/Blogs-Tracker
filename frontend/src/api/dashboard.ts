import axios from "axios";
import { error } from "console";

const API_URL = import.meta.env.VITE_BASE_URL

export const fetchAllBlogs = async (userId: string) => {
    console.log("Fetching blogs for user:", userId); // Keep this in development, but remove for production
    const res = await axios.get(`${API_URL}/blogs/${userId}`);
    return res.data;
}

export const GetCategories = async (userId: string) => {
    const res = await axios.get(`${API_URL}/categories/${userId}`)
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to fetch blogs")
}

export const PostCategories = async (userId: string, categoryName: string) => {
    const res = await axios.post(`${API_URL}/categories/${userId}`, {
        name: categoryName
    })
    if (res.status == 201) {
        return res.data;
    }
    throw new Error("Failed to create category")
}
export const DeleteCategories = async (categoryId: string) => {
    const res = await axios.delete(`${API_URL}/categories/${categoryId}`)
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to delete category")
}
export const UpdateCategory = async (categoryId: string, categoryName: string) => {
    const res = await axios.patch(`${API_URL}/categories/${categoryId}`, {
        name: categoryName
    })
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to update category")
}

export const GetTags = async (userId: string) => {
    const res = await axios.get(`${API_URL}/tags/${userId}`);
    if (res.status == 200) {
        return res.data
    }
    throw new Error("Failed to get Tags")
}

export const PostTag = async (newTag: string, userId: string, blogId: string) => {
    const res = await axios.post(`${API_URL}/add-tag`, {
        blogId,
        tagName: newTag,
        userId
    })
    if (res.status == 201) {
        return res.data
    }
    throw new Error("Failed to post Tag")
}
export const RemoveTag = async (tagId: string, blogId: string) => {
    const res = await axios.delete(`${API_URL}/delete-tag`, {
        data: {
            tagId,
            blogId
        }
    })
    if (res.status == 200) {
        return res.data
    }
    throw new Error("Failed to delete Tag")
}

export const PostBlog = async (url: string, title: string, isRead: boolean, categoryName: string, userId: string) => {
    if (categoryName == "null") {
        categoryName = ""
    }
    const res = await axios.post(`${API_URL}/add`, {
        url,
        title,
        isRead,
        categoryName,
        userId
    })
    if (res.status == 201) {
        return res.data
    }
    throw new Error("Failed to add blog")
}
// export const GetTags = async()