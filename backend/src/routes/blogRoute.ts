import { Router } from "express";
import { AddBlog, AddTagToBlog, DeleteBlog, GetDashboardData, RemoveTagFromBlog, UpdateBlogStatus } from "../controller/blogController.js";
import { Auth } from "../middleware/middleware.js";
import { CreateCategory, DeleteCategory, GetCategories, UpdateCategory } from "../controller/categoryTagController.js";


const router = Router();

// Dashboard - get blogs, categories, tags, stats
router.get("/dashboard/:userId", Auth, GetDashboardData);

// Add a new blog
router.post("/add", Auth, AddBlog);

// Update blog read/unread status
router.patch("/status", Auth, UpdateBlogStatus);

// Delete a blog
router.delete("/delete/:blogId", Auth, DeleteBlog);

// Add a tag to a blog
router.post("/add-tag", Auth, AddTagToBlog);
router.delete("/delete-tag", Auth, RemoveTagFromBlog);

/**
 * CATEGORY ROUTES
 */
router.post("/categories", Auth, CreateCategory);
router.get("/categories/:userId", Auth, GetCategories);
router.patch("/categories/:categoryId", Auth, UpdateCategory);
router.delete("/categories/:categoryId", Auth, DeleteCategory);

export default router;
