import { api } from "@/lib/axios";

export const fetchTags = async (userId: string) => {
    const { data } = await api.get(`/tags/${userId}`);
    return data;
};

export const createTag = async (
    userId: string,
    blogId: string,
    tagName: string
) => {
    const { data } = await api.post("/add-tag", {
        blogId,
        tagName,
        userId,
    });
    return data;
};

export const removeTag = async (
    tagId: string,
    blogId: string
) => {
    const { data } = await api.delete("/delete-tag", {
        data: { tagId, blogId },
    });
    return data;
};

export const deleteTagGlobal = async (tagId: string) => {
    const { data } = await api.delete(`/tags/${tagId}`);
    return data;
};
