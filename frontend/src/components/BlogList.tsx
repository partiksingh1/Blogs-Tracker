import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog } from "@/types/blog";
import { useStateContext } from "@/lib/ContextProvider";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SheetBar } from "./SheetBar";
import { useSearchContext } from "@/lib/SearchProvider";
import { useMemo } from "react";
import { useBlogs } from "@/api/useQueries";
export const BlogList = () => {
  const { user, loading, token } = useStateContext(); // Destructure `loading` and `user`
  const { search, selectedCategory } = useSearchContext();
  const blogQuery = useBlogs(user?.id, token as string)
  const blogs: Blog[] = blogQuery?.data?.blogs || []; // Ensure you're accessing the correct property

  const filteredBlogs = useMemo(() => {
    let result: Blog[] = blogs;
    if (selectedCategory) {
      result = result.filter((blog) => blog?.categoryId === selectedCategory);
    }
    if (!search) return result;
    return result.filter((blog) =>
      blog.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search, selectedCategory]);

  if (loading || blogQuery.isLoading) {
    return (
      <div className="p-4 mx-auto w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        <Skeleton className="h-30 w-full rounded-xl" />
        <Skeleton className="h-30 w-full rounded-xl" />
      </div>
    );
  }

  if (blogQuery.isError) {
    return (
      <div>
        Error fetching blogs:{" "}
        {blogQuery.error?.message || "Unknown error"}
      </div>
    );
  }

  if (blogs.length === 0) {
    return <div>No blogs found</div>;
  }

  if (filteredBlogs.length === 0) {
    return (
      <div className="flex w-full justify-center items-center">
        <div className="m-5 p-5 border-4 rounded-md">
          No results for “{search}”
        </div>
      </div>
    )
  }



  // Handle errors
  if (blogQuery.isError) {
    return <div>Error fetching blogs: {"Unknown error"}</div>;
  }

  return (
    <div className="mx-auto p-4">
      <div className="w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {filteredBlogs.map((blog: Blog) => (
          <Sheet key={blog.id}>
            <SheetTrigger asChild>
              {/* Ensure BlogCard handles the trigger */}
              {/* We use a div wrapper because BlogCard is a custom component and Trigger needs a DOM element ref */}
              <div className="cursor-pointer">
                <BlogCard blog={blog} />
              </div>
            </SheetTrigger>
            <SheetBar blog={blog} />
          </Sheet>

        ))}
      </div>
    </div>
  );
};
