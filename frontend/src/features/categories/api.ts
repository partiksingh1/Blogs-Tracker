import { api } from "@/lib/axios";

export const fetchCategories = async (userId: string) => {
    const { data } = await api.get(`/categories/${userId}`);
    return data;
};

export const createCategory = async (
    userId: string,
    name: string
) => {
    const { data } = await api.post(`/categories/${userId}`, {
        name,
    });
    return data;
};

export const deleteCategory = async (categoryId: string) => {
    const { data } = await api.delete(
        `/categories/${categoryId}`
    );
    return data;
};

export const updateCategory = async (
    categoryId: string,
    name: string
) => {
    const { data } = await api.patch(
        `/categories/${categoryId}`,
        { name }
    );
    return data;
};

export const addCategoryToBlog = async (
    blogId: string,
    userId: string,
    name: string
) => {
    const { data } = await api.put(
        `/categories/${blogId}/${userId}`,
        { name }
    );
    return data;
};
