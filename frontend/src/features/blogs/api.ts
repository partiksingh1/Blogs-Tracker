import { api } from "@/lib/axios";

export const fetchAllBlogs = async (userId: string) => {
    const { data } = await api.get(`/blogs/${userId}`);
    return data;
};

export const deleteBlog = async (blogId: string) => {
    const { data } = await api.delete(`/delete/${blogId}`);
    return data;
};

export const updateBlogStatus = async (
    blogId: string,
    status: boolean
) => {
    await api.patch(`/status`, { blogId, status });
    return true;
};

export const postBlog = async (payload: {
    url: string;
    title: string;
    isRead: boolean;
    categoryName: string;
    userId: string;
}) => {
    const { data } = await api.post(`/add`, payload);
    return data;
};

/* ✅ ADD THIS */
export const summarizeBlog = async (url: string) => {
    const { data } = await api.post(`/fetchContent`, { url });
    return data;
};
