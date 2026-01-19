import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";
import { fetchAllBlogs } from "@/api/dashboard";
import { useStateContext } from "@/lib/ContextProvider";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SheetBar } from "./SheetBar";
import { useBlogs } from "../api/useCategory";
export const BlogList = () => {
  const { user, loading } = useStateContext(); // Destructure `loading` and `user`
  const blogQuery = useBlogs(user?.id)
  // If the context is still loading user data, return loading state
  if (loading || blogQuery.isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mt-20">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-[125px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Handle errors
  if (blogQuery.isError) {
    return <div>Error fetching blogs: {blogQuery.error?.message || "Unknown error"}</div>;
  }


  const blogs = blogQuery.data.blogs || []; // Ensure you're accessing the correct property

  console.log("Blogs Data:", blogs); // Check the actual data

  if (blogs.length === 0) {
    return <div>No blogs found</div>;
  }

  return (
    <div className="mx-auto p-4">
      <div className="w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {blogs.map((blog: Blog) => (
          <Sheet key={blog.id}>
            <SheetTrigger asChild>
              {/* Ensure BlogCard handles the trigger */}
              <div onClick={() => console.log("BlogCard clicked")}>
                <BlogCard
                  blog={blog}
                  onStatusChange={() => { }}
                  onDelete={() => { }}
                  onTagDelete={() => { }}
                />
              </div>
            </SheetTrigger>
            <SheetBar blog={blog} />
          </Sheet>

        ))}
      </div>
    </div>
  );
};
