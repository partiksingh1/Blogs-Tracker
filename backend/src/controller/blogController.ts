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
        const [blogs, categories] = await Promise.all([
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
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.findMany({
                where: { userId },
                select: { id: true, name: true }
            }),
        ]);

        res.status(200).json({
            message: "Dashboard data fetched successfully",
            data: {
                blogs,
                categories,
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
    const { status, blogId } = req.body;

    if (!blogId || typeof status !== "boolean") {
        return res.status(400).json({
            message: "Invalid request — blogId, userId, and status(boolean) are required"
        });
    }

    try {
        const blog = await prisma.blog.update({
            where: { id: blogId },
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
    const { blogId, tagName } = req.body;

    if (!tagName) {
        return res.status(400).json({ error: 'tagName is required' });
    }

    try {
        // Fetch the blog
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Check if the tag is already in the blog
        if (blog.tagNames.includes(tagName)) {
            return res.status(400).json({ error: 'Tag already exists in this blog' });
        }

        // Add the new tag to the blog
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { tagNames: [...blog.tagNames, tagName] },
        });

        return res.status(200).json({ message: 'Tag added successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error adding tag:', error);
        return res.status(500).json({
            message: 'Internal server error while adding tag to blog',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const RemoveTagFromBlog = async (req: Request, res: Response): Promise<any> => {
    const { tagName, blogId } = req.body;

    if (!tagName) {
        return res.status(400).json({ error: 'tagName is required' });
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (!blog.tagNames.includes(tagName)) {
            return res.status(400).json({ error: 'Tag not found in this blog' });
        }

        // Remove the tag from the array
        const updatedTags = blog.tagNames.filter(tag => tag !== tagName);

        // Update the blog with the new tag array
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { tagNames: updatedTags },
        });

        return res.status(200).json({ message: 'Tag removed successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error removing tag:', error);
        return res.status(500).json({
            message: 'Internal server error while deleting tag from blog',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
