import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * =========================
 * CATEGORY CONTROLLERS
 * =========================
 */

// Create Category
export const CreateCategory = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    const { name } = req.body;

    if (!userId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — userId and category name are required"
        });
    }

    const cleanName = name.trim().toLowerCase();

    try {
        // 1. Check if category already exists for this user
        const existing = await prisma.category.findFirst({
            where: {
                userId,
                name: cleanName
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Category already exists for this user",
                data: existing
            });
        }

        // 2. Create category
        const category = await prisma.category.create({
            data: {
                userId,
                name: cleanName
            }
        });

        return res.status(201).json({
            message: "Category created successfully",
            data: category
        });

    } catch (error: any) {
        console.error("CreateCategory error:", error);
        return res.status(500).json({
            message: "Internal server error while creating category",
            error: error.message
        });
    }
};


// Get All Categories for User
export const GetCategories = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            message: "Invalid request — userId is required"
        });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { userId },
            select: {
                id: true,
                name: true
            }
        });

        res.status(200).json({
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while fetching categories",
            error: error.message
        });
    }
};

// Update Category
export const UpdateCategory = async (req: Request, res: Response): Promise<any> => {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!categoryId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — categoryId and new name are required"
        });
    }

    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: { name: name.toLowerCase(), updatedAt: new Date() }
        });

        res.status(200).json({
            message: "Category updated successfully",
            data: category
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while updating category",
            error: error.message
        });
    }
};

// Delete Category
export const DeleteCategory = async (req: Request, res: Response): Promise<any> => {
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.status(400).json({
            message: "Invalid request — categoryId is required"
        });
    }

    try {
        await prisma.category.delete({ where: { id: categoryId } });

        res.status(200).json({
            message: "Category deleted successfully",
            categoryId
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while deleting category",
            error: error.message
        });
    }
};

export const AddCategoryToBlog = async (req: Request, res: Response): Promise<any> => {
    const { blogId, userId } = req.params;
    const { name } = req.body;

    if (!blogId || !userId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — blogId, userId and category name are required"
        });
    }

    const cleanName = name.trim().toLowerCase();

    try {
        // 1️⃣ Check if category exists for this user
        let category = await prisma.category.findFirst({
            where: {
                userId,
                name: cleanName
            }
        });

        // 2️⃣ If not, create it
        if (!category) {
            category = await prisma.category.create({
                data: {
                    userId,
                    name: cleanName
                }
            });
        }

        // 3️⃣ Connect category to blog
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: {
                category: {
                    connect: { id: category.id }
                }
            },
        });

        return res.status(200).json({
            message: "Category added to blog successfully",
            data: updatedBlog
        });

    } catch (error: any) {
        console.error("AddCategoryToBlog error:", error);
        return res.status(500).json({
            message: "Internal server error while adding category to blog",
            error: error.message
        });
    }
};
// Delete Tag Completely
export const DeleteTag = async (req: Request, res: Response): Promise<any> => {
    const { tagId } = req.params;

    if (!tagId) {
        return res.status(400).json({
            message: "Tag ID is required"
        });
    }

    try {
        // 1️⃣ Check if tag is still attached to any blogs
        const tagWithBlogs = await prisma.tag.findUnique({
            where: { id: tagId },
            include: {
                blogs: true // relation must exist in schema
            }
        });

        if (!tagWithBlogs) {
            return res.status(404).json({
                message: "Tag not found"
            });
        }

        if (tagWithBlogs.blogs.length > 0) {
            return res.status(400).json({
                message: "Cannot delete tag. It is still used by blogs."
            });
        }

        // 2️⃣ Safe to delete
        await prisma.tag.delete({
            where: { id: tagId }
        });

        return res.status(200).json({
            message: "Tag deleted successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Error deleting tag",
            error: error.message
        });
    }
};

