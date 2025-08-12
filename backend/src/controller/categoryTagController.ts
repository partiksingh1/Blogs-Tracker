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
    const { userId, name } = req.body;

    if (!userId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — userId and category name are required"
        });
    }

    try {
        const category = await prisma.category.upsert({
            where: { userId_name: { userId, name: name.toLowerCase() } },
            update: {},
            create: { userId, name: name.toLowerCase() }
        });

        res.status(201).json({
            message: "Category created successfully",
            data: category
        });
    } catch (error: any) {
        res.status(500).json({
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
            orderBy: { createdAt: "desc" }
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

/**
 * =========================
 * TAG CONTROLLERS
 * =========================
 */

// Create Tag
export const CreateTag = async (req: Request, res: Response): Promise<any> => {
    const { userId, name } = req.body;

    if (!userId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — userId and tag name are required"
        });
    }

    try {
        const tag = await prisma.tag.upsert({
            where: { userId_name: { userId, name: name.toLowerCase() } },
            update: {},
            create: { userId, name: name.toLowerCase() }
        });

        res.status(201).json({
            message: "Tag created successfully",
            data: tag
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while creating tag",
            error: error.message
        });
    }
};

// Get All Tags for User
export const GetTags = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            message: "Invalid request — userId is required"
        });
    }

    try {
        const tags = await prisma.tag.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json({
            message: "Tags fetched successfully",
            data: tags
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while fetching tags",
            error: error.message
        });
    }
};

// Update Tag
export const UpdateTag = async (req: Request, res: Response): Promise<any> => {
    const { tagId } = req.params;
    const { name } = req.body;

    if (!tagId || !name?.trim()) {
        return res.status(400).json({
            message: "Invalid request — tagId and new name are required"
        });
    }

    try {
        const tag = await prisma.tag.update({
            where: { id: tagId },
            data: { name: name.toLowerCase() }
        });

        res.status(200).json({
            message: "Tag updated successfully",
            data: tag
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while updating tag",
            error: error.message
        });
    }
};

// Delete Tag
export const DeleteTag = async (req: Request, res: Response): Promise<any> => {
    const { tagId } = req.params;

    if (!tagId) {
        return res.status(400).json({
            message: "Invalid request — tagId is required"
        });
    }

    try {
        await prisma.tag.delete({ where: { id: tagId } });

        res.status(200).json({
            message: "Tag deleted successfully",
            tagId
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while deleting tag",
            error: error.message
        });
    }
};
