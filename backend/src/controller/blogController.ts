import { Request, Response } from "express"
import { BlogSchema } from "../model/blogSchema.js"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Single endpoint for dashboard data
export const GetDashboardData = async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({
            message: "Invalid user, please provide a userId"
        })
    }

    try {
        // Single query to get all needed data
        const [blogs, categories, tags] = await Promise.all([
            prisma.blog.findMany({
                where: { userId },
                select: {
                    id: true,
                    url: true,
                    title: true,
                    isRead: true,
                    categoryName: true,
                    tagNames: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.findMany({
                where: { userId },
                select: { id: true, name: true }
            }),
            prisma.tag.findMany({
                where: { userId },
                select: { id: true, name: true }
            })
        ]);

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: {
                blogs,
                categories,
                tags,
                stats: {
                    totalBlogs: blogs.length,
                    readBlogs: blogs.filter(b => b.isRead).length,
                    unreadBlogs: blogs.filter(b => !b.isRead).length
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const AddBlog = async (req: Request, res: Response): Promise<any> => {
    const validation = BlogSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            message: "blog addition validation error",
            err: validation.error.format()
        })
    }

    try {
        const { url, title, isRead, categoryName, userId } = validation.data;

        // Use transaction for consistency
        const result = await prisma.$transaction(async (tx) => {
            // Upsert category
            const category = await tx.category.upsert({
                where: {
                    userId_name: { userId, name: categoryName ? categoryName.toLowerCase() : "" }
                },
                update: {},
                create: {
                    name: categoryName ? categoryName.toLowerCase() : "",
                    userId
                }
            });

            // Create blog with denormalized data
            const blog = await tx.blog.create({
                data: {
                    url,
                    title,
                    userId,
                    isRead: isRead || false,
                    categoryName: category.name,
                    tagIds: [],
                    tagNames: []
                }
            });

            return { blog, category };
        });

        res.status(201).json({
            message: "Blog added successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error in adding the blog"
        })
    }
}

export const UpdateBlogStatus = async (req: Request, res: Response): Promise<any> => {
    const { userId, status } = req.body;
    const { blogId } = req.params;

    if (!blogId || !userId || typeof status !== "boolean") {
        return res.status(400).json({
            message: "Invalid request — blogId, userId, and status(boolean) are required"
        });
    }

    try {
        const blog = await prisma.blog.update({
            where: { id: blogId, userId },
            data: { isRead: status },
        });
        if (blog) {
            res.status(200).json({
                message: "Blog status updated successfully",
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while updating blog status",
            error: error.message
        });
    }
};

/**
 * Delete Blog
 */
export const DeleteBlog = async (req: Request, res: Response): Promise<any> => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({
            message: "Invalid request — blogId is required"
        });
    }

    try {
        await prisma.blog.delete({ where: { id: blogId } });

        res.status(200).json({
            message: "Blog deleted successfully",
            blogId
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while deleting blog",
            error: error.message
        });
    }
};

/**
 * Add Tag to Blog
 */
export const AddTagToBlog = async (req: Request, res: Response): Promise<any> => {
    const { blogId, userId, tagName } = req.body;

    if (!blogId || !userId || !tagName?.trim()) {
        return res.status(400).json({
            message: "Invalid request — blogId, userId, and tagName are required"
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Upsert tag
            const tag = await tx.tag.upsert({
                where: {
                    userId_name: { userId, name: tagName.toLowerCase() }
                },
                update: {},
                create: {
                    name: tagName.toLowerCase(),
                    userId
                }
            });

            // Update blog's tag arrays (avoid duplicate pushes)
            const existingBlog = await tx.blog.findUnique({
                where: { id: blogId },
                select: { tagIds: true, tagNames: true }
            });

            if (!existingBlog) throw new Error("Blog not found");

            const updatedTagIds = Array.from(new Set([...existingBlog.tagIds, tag.id]));
            const updatedTagNames = Array.from(new Set([...existingBlog.tagNames, tag.name]));

            const blog = await tx.blog.update({
                where: { id: blogId },
                data: {
                    tagIds: updatedTagIds,
                    tagNames: updatedTagNames
                }
            });

            return { blog, tag };
        });

        res.status(200).json({
            message: "Tag added successfully to the blog",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error while adding tag to blog",
            error: error.message
        });
    }
};
