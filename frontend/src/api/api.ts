import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL
export const fetchAllBlogs = async (userId: string, token: string) => {

    console.log("Fetching blogs for user:", userId); // Keep this in development, but remove for production
    const res = await axios.get(`${API_URL}/blogs/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const DeleteBlog = async (blogId: string, token: string) => {
    const res = await axios.delete(`${API_URL}/delete/${blogId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        return res.data
    }
    throw new Error("Failed to delete blog")
}
export const UpdateBlog = async (status: boolean, blogId: string, token: string) => {
    const res = await axios.patch(`${API_URL}/status`, {
        status,
        blogId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return true;
    }
    throw new Error("Failed to update the status")
}

export const GetCategories = async (userId: string, token: string) => {
    const res = await axios.get(`${API_URL}/categories/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to fetch blogs")
}

export const PostCategories = async (userId: string, categoryName: string, token: string) => {
    const res = await axios.post(`${API_URL}/categories/${userId}`, {
        name: categoryName
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 201) {
        return res.data;
    }
    throw new Error("Failed to create category")
}
export const DeleteCategories = async (categoryId: string, token: string) => {
    const res = await axios.delete(`${API_URL}/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to delete category")
}
export const UpdateCategory = async (categoryId: string, categoryName: string, token: string) => {
    const res = await axios.patch(`${API_URL}/categories/${categoryId}`, {
        name: categoryName
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to update category")
}

export const GetTags = async (userId: string, token: string) => {
    const res = await axios.get(`${API_URL}/tags/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (res.status == 200) {
        return res.data
    }
    throw new Error("Failed to get Tags")
}

export const PostTag = async (newTag: string, userId: string, blogId: string, token: string) => {
    const res = await axios.post(`${API_URL}/add-tag`, {
        blogId,
        tagName: newTag,
        userId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 201) {
        return res.data
    }
    throw new Error("Failed to post Tag")
}
export const RemoveTag = async (tagId: string, blogId: string, token: string) => {
    const res = await axios.delete(`${API_URL}/delete-tag`, {
        data: {
            tagId,
            blogId
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return res.data
    }
    throw new Error("Failed to delete Tag")
}

export const PostBlog = async (url: string, title: string, isRead: boolean, categoryName: string, userId: string, token: string) => {
    if (categoryName == "null") {
        categoryName = ""
    }
    const res = await axios.post(`${API_URL}/add`, {
        url,
        title,
        isRead,
        categoryName,
        userId
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 201) {
        return res.data
    }
    throw new Error("Failed to add blog")
}
export const Summarize = async (url: string, token: string) => {
    const res = await axios.post(`${API_URL}/fetchContent`, {
        url
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if (res.status == 200) {
        return res.data;
    }
    throw new Error("Failed to summarize this url")
}