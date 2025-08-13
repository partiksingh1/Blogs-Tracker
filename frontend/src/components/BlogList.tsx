import { BlogCard } from "./BlogCard";
import { useEffect, useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "./ui/card";
import { Blog } from "@/types/blog";

interface Category {
  id: string;
  name: string;
}

export const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [filterBy, setFilterby] = useState("all");
  const [categoryBy, setCategoryBy] = useState("all");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Get auth data from localStorage
  const getAuthData = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user');
    return { token, userId };
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    const { token, userId } = getAuthData();

    if (!token || !userId) {
      console.error("Please login to continue");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/dashboard/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.message === "Dashboard data fetched successfully") {
        const { blogs: rawBlogs, categories } = result.data;

        // Transform backend data to match frontend Blog interface
        const transformedBlogs: Blog[] = rawBlogs.map((blog: any) => ({
          id: blog.id,
          title: blog.title,
          url: blog.url,
          isRead: blog.isRead,
          createdAt: new Date(blog.createdAt),
          categories: blog.categoryName
            ? [{ id: `cat_${blog.categoryName}`, name: blog.categoryName }]
            : [],
          tags: blog.tagNames?.map((tagName: string) => ({
            name: tagName
          })) || []
        }));

        setBlogs(transformedBlogs);
        setCategories(categories);
      } else {
        throw new Error(result.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (blogId: string, newStatus: boolean) => {
    const { token, userId } = getAuthData();

    if (!token || !userId) {
      console.error("Please login to continue");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.message === "Blog status updated successfully") {
        // Update local state
        setBlogs(prevBlogs =>
          prevBlogs.map(blog =>
            blog.id === blogId ? { ...blog, isRead: newStatus } : blog
          )
        );
        console.log("Blog status updated successfully");
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
    }
  };

  // Handle delete
  const handleDelete = async (blogId: string) => {
    const { token } = getAuthData();

    if (!token) {
      console.error("Please login to continue");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/delete/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.message === "Blog deleted successfully") {
        // Update local state
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
        console.log("Blog deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  const handleTagDelete = (blogId: string, tagName: string) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === blogId
          ? { ...blog, tags: blog.tags.filter(tag => tag.name !== tagName) }
          : blog
      )
    );
  }
  const handleTagAdd = (blogId: string, tagName: string) => {
    setBlogs(prevBlogs => {
      const updatedBlogs = prevBlogs.map(blog =>
        blog.id === blogId
          ? {
            ...blog,
            tags: blog.tags.some(tag => tag.name === tagName)
              ? blog.tags // If tag already exists, leave tags unchanged
              : [...blog.tags, { name: tagName }] // Add tag only if it doesn't exist
          }
          : blog
      );

      console.log('Updated Blogs:', updatedBlogs); // Debugging

      return updatedBlogs;
    });
  };


  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Memoize filtered and sorted blogs to avoid unnecessary recalculations
  const filteredAndSortedBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        if (filterBy === "read") return blog.isRead;
        if (filterBy === "unread") return !blog.isRead;
        return true;
      })
      .filter((blog: Blog) =>
        blog.title && blog.title.toLowerCase().includes(search.toLowerCase())
      )
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
  }, [blogs, filterBy, search, categoryBy, sort]);

  const handleSelectOpenChange = (open: boolean) => {
    setIsSelectOpen(open);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 mt-20">
        {[...Array(6)].map((_, index) => (
          <div className="flex flex-col space-y-3" key={index}>
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[220px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-screen-xl px-4 ${isSelectOpen ? "blur-background" : ""}`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search blogs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
          aria-label="Search blogs"
        />
        <Select
          value={sort}
          onValueChange={setSort}
          onOpenChange={handleSelectOpenChange}
          aria-label="Sort blogs"
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterBy}
          onValueChange={setFilterby}
          onOpenChange={handleSelectOpenChange}
          aria-label="Filter blogs by read status"
        >
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
          onValueChange={setCategoryBy}
          onOpenChange={handleSelectOpenChange}
          aria-label="Filter blogs by category"
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories
              .filter((cat) => typeof cat.name === "string" && cat.name.trim() !== "")
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
          {filteredAndSortedBlogs.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-6 shadow-lg rounded-xl">
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <h1 className="text-3xl font-semibold text-gray-800">
                    No blogs found
                  </h1>
                  <p className="text-lg text-gray-600">
                    Try adjusting your filters or add new blogs to get started.
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            filteredAndSortedBlogs.map((blog: Blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onTagDelete={handleTagDelete}
                onAddTag={handleTagAdd}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};