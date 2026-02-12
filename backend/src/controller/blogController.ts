import { Request, Response } from "express";
import { BlogSchema } from "../model/blogSchema.js";
import { prisma } from "../config/db.js";

/**
 * =========================
 * ADD BLOG
 * =========================
 */
export const AddBlog = async (req: Request, res: Response): Promise<any> => {
    const validation = BlogSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "Blog validation failed",
            errors: validation.error.format(),
        });
    }

    try {
        const { url, title, isRead, categoryName, userId } = validation.data;

        const result = await prisma.$transaction(async (tx) => {
            let category = null;

            if (categoryName?.trim()) {
                const cleanName = categoryName.trim().toLowerCase();
                category = await tx.category.findFirst({ where: { name: cleanName, userId } });
            }

            const blog = await tx.blog.create({
                data: {
                    url,
                    title,
                    authorId: userId,
                    isRead: isRead ?? false,
                    categoryId: category?.id ?? null,
                },
            });

            return { blog, category };
        });

        res.status(201).json({ message: "Blog added successfully", data: result });
    } catch (error) {
        console.error("AddBlog error:", error);
        res.status(500).json({ message: "Internal server error while adding blog" });
    }
};

/**
 * =========================
 * UPDATE BLOG STATUS
 * =========================
 */
export const UpdateBlogStatus = async (req: Request, res: Response): Promise<any> => {
    const { blogId, status } = req.body;

    if (!blogId || typeof status !== "boolean") {
        return res.status(400).json({ message: "Invalid request — blogId and status(boolean) are required" });
    }

    try {
        await prisma.blog.update({ where: { id: blogId }, data: { isRead: status } });
        res.status(200).json({ message: "Blog status updated successfully" });
    } catch (error: any) {
        console.error("UpdateBlogStatus error:", error);
        res.status(500).json({ message: "Internal server error while updating blog status", error: error.message });
    }
};

/**
 * =========================
 * GET ALL BLOGS
 * =========================
 */
export const GetAllBlogs = async (req: Request, res: Response): Promise<any> => {
    const authorId = req.params.userId?.trim();

    if (!authorId) {
        return res.status(400).json({ message: "Invalid request — userId is required" });
    }

    try {
        const blogs = await prisma.blog.findMany({
            where: { authorId },
            include: { tags: true, category: true },
        });

        res.status(200).json({ message: "Blogs fetched successfully", data: { blogs } });
    } catch (error) {
        console.error("GetAllBlogs error:", error);
        res.status(500).json({ message: "Internal server error while fetching blogs" });
    }
};

/**
 * =========================
 * DELETE BLOG
 * =========================
 */
export const DeleteBlog = async (req: Request, res: Response): Promise<any> => {
    const blogId = req.params.blogId?.trim();

    if (!blogId) {
        return res.status(400).json({ message: "Invalid request — blogId is required" });
    }

    try {
        await prisma.blog.delete({ where: { id: blogId } });
        res.status(200).json({ message: "Blog deleted successfully", data: { blogId } });
    } catch (error: any) {
        console.error("DeleteBlog error:", error);
        res.status(500).json({ message: "Internal server error while deleting blog", error: error.message });
    }
};

/**
 * =========================
 * ADD TAG TO BLOG
 * =========================
 */
export const AddTagToBlog = async (req: Request, res: Response): Promise<any> => {
    const { blogId, tagName, userId } = req.body;

    if (!blogId?.trim() || !tagName?.trim() || !userId?.trim()) {
        return res.status(400).json({ message: "blogId, tagName, and userId are required" });
    }

    try {
        const blog = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        let tag = await prisma.tag.findFirst({ where: { name: tagName.trim(), userId } });
        if (!tag) {
            tag = await prisma.tag.create({ data: { name: tagName.trim(), userId } });
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { tags: { connect: { id: tag.id } } },
            include: { tags: true },
        });

        res.status(201).json({ message: "Tag added successfully", data: updatedBlog });
    } catch (error: any) {
        console.error("AddTagToBlog error:", error);
        res.status(500).json({ message: "Internal server error while adding tag", error: error.message });
    }
};

/**
 * =========================
 * REMOVE TAG FROM BLOG
 * =========================
 */
export const RemoveTagFromBlog = async (req: Request, res: Response): Promise<any> => {
    const { tagId, blogId } = req.body;

    if (!tagId?.trim() || !blogId?.trim()) {
        return res.status(400).json({ message: "blogId and tagId are required" });
    }

    try {
        const blog = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const tag = await prisma.tag.findUnique({ where: { id: tagId } });
        if (!tag) return res.status(404).json({ message: "Tag not found" });

        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { tags: { disconnect: { id: tagId } } },
            include: { tags: true },
        });

        res.status(200).json({ message: "Tag removed successfully", data: updatedBlog });
    } catch (error: any) {
        console.error("RemoveTagFromBlog error:", error);
        res.status(500).json({ message: "Internal server error while removing tag", error: error.message });
    }
};

/**
 * =========================
 * GET ALL TAGS
 * =========================
 */
export const GetAllTags = async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.userId?.trim();

    if (!userId) {
        return res.status(400).json({ message: "Invalid request — userId is required" });
    }

    try {
        const tags = await prisma.tag.findMany({ where: { userId } });

        res.status(200).json({
            message: tags.length ? "Tags fetched successfully" : "No tags found",
            data: { tags },
        });
    } catch (error: any) {
        console.error("GetAllTags error:", error);
        res.status(500).json({ message: "Internal server error while fetching tags", error: error.message });
    }
};
