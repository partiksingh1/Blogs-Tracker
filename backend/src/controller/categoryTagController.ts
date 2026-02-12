import { Request, Response } from "express";
import { prisma } from "../config/db.js";

/**
 * =========================
 * CATEGORY CONTROLLERS
 * =========================
 */

// Create Category
export const CreateCategory = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;
    const { name } = req.body;

    if (!userId?.trim() || !name?.trim()) {
        return res.status(400).json({ message: "userId and category name are required" });
    }

    const cleanName = name.trim().toLowerCase();

    try {
        const existing = await prisma.category.findFirst({ where: { userId, name: cleanName } });

        if (existing) {
            return res.status(400).json({ message: "Category already exists for this user", data: existing });
        }

        const category = await prisma.category.create({ data: { userId, name: cleanName } });

        return res.status(201).json({ message: "Category created successfully", data: category });
    } catch (error: any) {
        console.error("CreateCategory error:", error);
        return res.status(500).json({ message: "Internal server error while creating category", error: error.message });
    }
};

// Get All Categories for User
export const GetCategories = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;

    if (!userId?.trim()) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const categories = await prisma.category.findMany({ where: { userId }, select: { id: true, name: true } });

        return res.status(200).json({ message: "Categories fetched successfully", data: categories });
    } catch (error: any) {
        console.error("GetCategories error:", error);
        return res.status(500).json({ message: "Internal server error while fetching categories", error: error.message });
    }
};

// Update Category
export const UpdateCategory = async (req: Request, res: Response): Promise<any> => {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!categoryId?.trim() || !name?.trim()) {
        return res.status(400).json({ message: "categoryId and new name are required" });
    }

    try {
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: { name: name.trim().toLowerCase(), updatedAt: new Date() },
        });

        return res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error: any) {
        console.error("UpdateCategory error:", error);
        return res.status(500).json({ message: "Internal server error while updating category", error: error.message });
    }
};

// Delete Category
export const DeleteCategory = async (req: Request, res: Response): Promise<any> => {
    const { categoryId } = req.params;

    if (!categoryId?.trim()) {
        return res.status(400).json({ message: "categoryId is required" });
    }

    try {
        await prisma.category.delete({ where: { id: categoryId } });

        return res.status(200).json({ message: "Category deleted successfully", data: { categoryId } });
    } catch (error: any) {
        console.error("DeleteCategory error:", error);
        return res.status(500).json({ message: "Internal server error while deleting category", error: error.message });
    }
};

// Add Category to Blog
export const AddCategoryToBlog = async (req: Request, res: Response): Promise<any> => {
    const { blogId, userId } = req.params;
    const { name } = req.body;

    if (!blogId?.trim() || !userId?.trim() || !name?.trim()) {
        return res.status(400).json({ message: "blogId, userId and category name are required" });
    }

    const cleanName = name.trim().toLowerCase();

    try {
        // Find or create category
        let category = await prisma.category.findFirst({ where: { userId, name: cleanName } });

        if (!category) {
            category = await prisma.category.create({ data: { userId, name: cleanName } });
        }

        // Connect category to blog
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { category: { connect: { id: category.id } } },
        });

        return res.status(200).json({ message: "Category added to blog successfully", data: updatedBlog });
    } catch (error: any) {
        console.error("AddCategoryToBlog error:", error);
        return res.status(500).json({ message: "Internal server error while adding category to blog", error: error.message });
    }
};

// Delete Tag Completely
export const DeleteTag = async (req: Request, res: Response): Promise<any> => {
    const { tagId } = req.params;

    if (!tagId?.trim()) {
        return res.status(400).json({ message: "tagId is required" });
    }

    try {
        const tag = await prisma.tag.findUnique({
            where: { id: tagId },
            include: { blogs: true }, // make sure relation exists in schema
        });

        if (!tag) return res.status(404).json({ message: "Tag not found" });

        if (tag.blogs.length > 0) {
            return res.status(400).json({ message: "Cannot delete tag. It is still used by blogs." });
        }

        await prisma.tag.delete({ where: { id: tagId } });

        return res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error: any) {
        console.error("DeleteTag error:", error);
        return res.status(500).json({ message: "Internal server error while deleting tag", error: error.message });
    }
};
