
import { BlogCard } from "./BlogCard";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "./ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteBlog, fetchBlogs, fetchCategories, updateBlogStatus } from "@/store/thunks";
export const BlogList = () => {
  console.log("0) Bloglist rendered");
  const dispatch = useAppDispatch();
  const { blogs, isLoading, categories } = useAppSelector((state) => state.blog);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [filterBy, setFilterby] = useState("all");
  const [categoryBy, setCategoryBy] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const fetchData = useCallback(async () => {
    console.log("2)inside the fetchData of first useEffect hook in bloglist ");
    await dispatch(fetchCategories());
    await dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    console.log("1) first useEffect hook in bloglist ");
    fetchData();
  }, [fetchData]);

  // Filter and sort blogs based on search, filter, and sort criteria
  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      if (filterBy === "read") return blog.isRead;
      if (filterBy === "unread") return !blog.isRead;
      return true;
    })
    .filter((blog) => blog.title?.toLowerCase().includes(search.toLowerCase()))
    .filter((blog) => {
      if (!categoryBy || categoryBy === "all") return true;

      return blog.categories?.some(
        (cat) => cat.name.toLowerCase().trim() === categoryBy.trim().toLowerCase()
      );
    })

    .sort((a, b) => {
      if (sort === "title") return (a.title || "").localeCompare(b.title || "");
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

  const handleSelectOpenChange = (open: boolean | ((prevState: boolean) => boolean)) => {
    setIsSelectOpen(open);
  };
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mt-20">
        {[...Array(3)].map((_, index) => (
          <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="h-[125px] w-[350px] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-[350px]" />
              <Skeleton className="h-4 w-[220px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }



  return (
    <div className={`mx-auto max-w-screen-xl px-4 ${isSelectOpen ? 'blur-background' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search blogs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={sort} onValueChange={setSort} onOpenChange={handleSelectOpenChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterby} onOpenChange={handleSelectOpenChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categoryBy}
          onValueChange={(value) => {
            console.log("Category selected:", value);  // ✅ Debug line
            setCategoryBy(value);
          }}
          onOpenChange={handleSelectOpenChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories
              .filter((cat) => typeof cat.name === "string" && cat.name.trim() !== "")
              .filter((cat) => cat.name.trim().length > 0) // ensure no empty string values
              .map((cat) => {
                const trimmedName = cat.name.trim();
                return (
                  <SelectItem key={cat.id} value={trimmedName}>
                    {trimmedName}
                  </SelectItem>
                );
              })}
          </SelectContent>

        </Select>


      </div>
      <div className="w-full flex flex-col justify-center items-center sm:flex-row gap-4">
        <div className="w-full grid gap-6 md:grid-cols-3 lg:grid-cols-3">
          {blogs.length === 0 ? (
            <Card className="p-6 shadow-lg rounded-xl">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                  Start your journey by adding content
                </h1>
                <p className="text-lg text-gray-600">
                  It’s easy to begin. Just add a few blogs to get started with your content journey.
                </p>
              </div>
            </Card>

          ) : (
            filteredAndSortedBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onStatusChange={(id, status) => dispatch(updateBlogStatus({ blogId: id, status }))}
                onDelete={(id) => dispatch(deleteBlog(id))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};