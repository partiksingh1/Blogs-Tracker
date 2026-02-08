import { Request, Response } from "express"
import { BlogSchema } from "../model/blogSchema.js"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Single endpoint for dashboard data
export const GetDashboardData = async (req: Request, res: Response): Promise<any> => {
    const authorId = req.params.userId;

    if (!authorId) {
        return res.status(400).json({
            message: "Invalid user, please provide a userId"
        })
    }

    try {
        // Single query to get all needed data
        const [blogs, categories] = await Promise.all([
            prisma.blog.findMany({
                where: { authorId },
                select: {
                    id: true,
                    url: true,
                    title: true,
                    isRead: true,
                    categoryId: true,
                    tags: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.category.findMany({
                where: { userId: authorId },
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
        });
    }

    try {
        const { url, title, isRead, categoryName, userId } = validation.data;

        const result = await prisma.$transaction(async (tx) => {
            let category = null;

            // If categoryName is provided, try to find or create it
            if (categoryName && categoryName.trim() !== "") {
                const cleanName = categoryName.trim().toLowerCase();

                // Try to find existing category
                category = await tx.category.findFirst({
                    where: { name: cleanName, userId }
                });

                // // If no category found → create one
                // if (!category) {
                //     category = await tx.category.create({
                //         data: {
                //             name: cleanName,
                //             userId
                //         }
                //     });
                // }
            }

            // Now create blog
            const blog = await tx.blog.create({
                data: {
                    url,
                    title,
                    authorId: userId,
                    isRead: isRead ?? false,
                    categoryId: category ? category.id : null,  // ❗ correct ID, not name
                }
            });

            return { blog, category };
        });

        return res.status(201).json({
            message: "Blog added successfully",
            data: result
        });

    } catch (error) {
        console.error("AddBlog error:", error);
        return res.status(500).json({
            message: "Internal server error in adding the blog"
        });
    }
};

export const UpdateBlogStatus = async (req: Request, res: Response): Promise<any> => {
    const { status, blogId } = req.body;

    if (!blogId || typeof status !== "boolean") {
        return res.status(400).json({
            message: "Invalid request — blogId, and status(boolean) are required"
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

export const GetAllBlogs = async (req: Request, res: Response): Promise<any> => {
    const authorId = req.params.userId;
    try {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: authorId
            },
            include: {
                tags: true
            }
        })
        res.status(200).json({
            message: "Blogs fetched successfully",
            data: {
                blogs
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error while fetching blogs"
        })
    }

}

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
    const { blogId, tagName, userId } = req.body;

    if (!tagName || !blogId) {
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

        let tag = await prisma.tag.findFirst({
            where: {
                name: tagName,
                userId: userId
            }
        })
        if (!tag) {
            tag = await prisma.tag.create({
                data: {
                    name: tagName,
                    userId: userId
                }
            })
        }
        // Add the new tag to the blog
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: {
                tags: {
                    connect: {
                        id: tag.id
                    }
                }
            },
            include: {
                tags: true
            }
        });

        return res.status(201).json({ message: 'Tag added successfully', blog: updatedBlog });
    } catch (error) {
        console.error('Error adding tag:', error);
        return res.status(500).json({
            message: 'Internal server error while adding tag to blog',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const RemoveTagFromBlog = async (req: Request, res: Response): Promise<any> => {
    const { tagId, blogId } = req.body;

    if (!tagId) {
        return res.status(400).json({ error: 'tagName is required' });
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const tag = await prisma.tag.findFirst({
            where: {
                id: tagId
            }
        })
        if (!tag) {
            return res.status(404).json({
                error: "Tag not found or does not belong to user",
            });
        }
        // Update the blog with the new tag array
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: {
                tags: {
                    disconnect: {
                        id: tagId
                    }
                }
            },
            include: {
                tags: true
            }
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

export const GetAllTags = async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.userId;
    try {
        const tags = await prisma.tag.findMany({
            where: {
                userId
            }
        })
        if (!tags) {
            return res.status(404).json({
                message: "No Tags"
            })
        }
        res.status(200).json({
            message: "Tags successfully fetched",
            tags
        })
    } catch (error) {
        console.error('Error fetching tags:', error);
        return res.status(500).json({
            message: 'Internal server error while fetching tags',
            error: error instanceof Error ? error.message : String(error),
        });
    }
}