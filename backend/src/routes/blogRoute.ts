import { Router } from "express";
import { AddBlog, AddTagToBlog, DeleteBlog, GetDashboardData, UpdateBlogStatus } from "../controller/blogController.js";
import { Auth } from "../middleware/middleware.js";
import { CreateCategory, CreateTag, DeleteCategory, DeleteTag, GetCategories, GetTags, UpdateCategory, UpdateTag } from "../controller/categoryTagController.js";


const router = Router();

// Dashboard - get blogs, categories, tags, stats
router.get("/dashboard/:userId", Auth, GetDashboardData);

// Add a new blog
router.post("/add", Auth, AddBlog);

// Update blog read/unread status
router.patch("/status/:blogId", Auth, UpdateBlogStatus);

// Delete a blog
router.delete("/:blogId", Auth, DeleteBlog);

// Add a tag to a blog
router.post("/add-tag", Auth, AddTagToBlog);

/**
 * CATEGORY ROUTES
 */
router.post("/categories", Auth, CreateCategory);
router.get("/categories/:userId", Auth, GetCategories);
router.patch("/categories/:categoryId", Auth, UpdateCategory);
router.delete("/categories/:categoryId", Auth, DeleteCategory);

/**
 * TAG ROUTES
 */
router.get("/tags/:userId", Auth, GetTags);
router.patch("/tags/:tagId", Auth, UpdateTag);
router.delete("/tags/:tagId", Auth, DeleteTag);

export default router;
