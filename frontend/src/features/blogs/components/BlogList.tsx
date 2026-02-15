import { BlogCard } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Blog } from "@/types/blog";
import { useStateContext } from "@/lib/ContextProvider";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { SheetBar } from "./BlogSheet";
import { useSearchContext } from "@/lib/SearchProvider";
import { useMemo } from "react";
import { useBlogs } from "@/features/blogs/hooks/useBlog";

export const BlogList = () => {
  const { user, loading } = useStateContext();
  const { search, selectedCategory } = useSearchContext();

  const blogQuery = useBlogs(user?.id);
  const blogs: Blog[] = blogQuery?.data?.blogs || [];

  const filteredBlogs = useMemo(() => {
    let result = blogs;

    if (selectedCategory) {
      result = result.filter((blog) => blog?.categoryId === selectedCategory);
    }

    if (search) {
      result = result.filter((blog) =>
        blog.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [blogs, search, selectedCategory]);

  // Show skeletons while loading
  if (loading || blogQuery.isLoading) {
    return (
      <div className="p-4 mx-auto w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        <Skeleton className="h-30 w-full rounded-xl" />
        <Skeleton className="h-30 w-full rounded-xl" />
        <Skeleton className="h-30 w-full rounded-xl" />
      </div>
    );
  }

  // Show error if query failed
  if (blogQuery.isError) {
    return (
      <div className="text-red-600 p-4">
        Error fetching blogs: {blogQuery.error?.message || "Unknown error"}
      </div>
    );
  }

  // No blogs at all
  if (blogs.length === 0) {
    return <div className="p-4 text-center">No blogs found.</div>;
  }

  // No filtered results
  if (filteredBlogs.length === 0) {
    return (
      <div className="flex w-full justify-center items-center p-4">
        <div className="m-5 p-5 border-4 rounded-md text-center">
          No results for “{search}”
        </div>
      </div>
    );
  }

  // Render blog cards with Sheet modal
  return (
    <div className="mx-auto p-4">
      <div className="w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {filteredBlogs.map((blog: Blog) => (
          <Sheet key={blog.id}>
            <SheetTrigger asChild>
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
