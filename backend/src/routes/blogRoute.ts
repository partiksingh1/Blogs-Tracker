import express from "express";
import { AddBlog, CreateCategory, JoinTags, DeleteBlogById, DeleteCategory, EditBlogById, GetBlogByid, GetBlogs, DeleteTags, GetCategory, } from "../controller/blogController.js";
import { Auth } from "../middleware/middleware.js";

export const blogRouter = express.Router();

blogRouter.post("/blog",Auth,AddBlog);
blogRouter.get("/blogs/:userId",Auth,GetBlogs);
blogRouter.get("/blog/:blogId",Auth,GetBlogByid);
blogRouter.post("/category",Auth,CreateCategory);
blogRouter.get("/category/:userId",Auth,GetCategory);
blogRouter.delete("/category",Auth,DeleteCategory);
blogRouter.put("/blog/:blogId",Auth,EditBlogById);
blogRouter.delete("/blog/:blogId",Auth,DeleteBlogById);
blogRouter.post("/blog/tag",Auth,JoinTags);
blogRouter.delete("/delete/tag",Auth,DeleteTags);


