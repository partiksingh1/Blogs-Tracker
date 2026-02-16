export const queryKeys = {
    blogs: (userId: string) => ["blogs", userId],
    categories: (userId: string) => ["categories", userId],
    tags: (userId: string) => ["tags", userId],
};
