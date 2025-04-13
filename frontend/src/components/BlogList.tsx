import { Blog } from "@/types/blog";
import { BlogCard } from "./BlogCard";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import toast from 'react-hot-toast';
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "./ui/card";
export const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [filterBy, setFilterby] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch blogs from the API
  const fetchBlogs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      toast.error("Invalid Login, Please Login again");
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/blogs/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs.");
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle status change for a blog
  const handleStatusChange = (blogId: number, newStatus: boolean) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId ? { ...blog, isRead: newStatus } : blog
      )
    );
  };
  const handleDelete = (blogId: number) => {
    setBlogs((prevBlogs) => prevBlogs.filter(blog => blog.id !== blogId));
  };



  // Filter and sort blogs based on search, filter, and sort criteria
  const filteredAndSortedBlogs = blogs
    .filter((blog) => {
      if (filterBy === "read") return blog.isRead;
      if (filterBy === "unread") return !blog.isRead;
      return true; // If filterBy is "all", no filtering is applied
    })
    .filter((blog) => blog.title?.toLowerCase().includes(search.toLowerCase())) // Filter by search term
    .sort((a, b) => {
      if (sort === "title") {
        return (a.title || "").localeCompare(b.title || ""); // Sort by title
      }
      const dateA = new Date(a.createdAt).getTime(); // Convert to timestamp
      const dateB = new Date(b.createdAt).getTime(); // Convert to timestamp
      return dateB - dateA; // Sort by createdAt (newest first)
    });
  if (loading) {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search blogs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={setFilterby}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
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
                onStatusChange={(id, status) => handleStatusChange(id, status)} // Convert to string
                onDelete={handleDelete} // Pass the delete handler
                fetchBlogs={fetchBlogs}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};