import { Blog, Tag } from "@/types/blog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, ExternalLink, GemIcon, Loader2, Plus, StarIcon, Stars, Trash2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog"; // Import ShadCN modal components
import { Badge } from "@/components/ui/badge"
import { Input } from "./ui/input"
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import axios from "axios";
const colors = [
    "bg-red-600", "bg-red-700", "bg-red-800", // Red shades
    "bg-blue-600", "bg-blue-700", "bg-blue-800", // Blue shades
    "bg-green-600", "bg-green-700", "bg-green-800", // Green shades
    "bg-yellow-500", "bg-yellow-600", "bg-yellow-700", // Yellow shades
    "bg-purple-600", "bg-purple-700", "bg-purple-800", // Purple shades
    "bg-pink-500", "bg-pink-600", "bg-pink-700", // Pink shades
    "bg-orange-500", "bg-orange-600", "bg-orange-700", // Orange shades
    "bg-teal-500", "bg-teal-600", "bg-teal-700", // Teal shades
    "bg-indigo-600", "bg-indigo-700", "bg-indigo-800", // Indigo shades
    "bg-gray-600", "bg-gray-700", "bg-gray-800", // Gray shades
    "bg-cyan-500", "bg-cyan-600", "bg-cyan-700", // Cyan shades
    "bg-lime-600", "bg-lime-700", "bg-lime-800", // Lime shades
    "bg-amber-500", "bg-amber-600", "bg-amber-700", // Amber shades
];

interface BlogCardProps {
    blog: Blog
    onStatusChange: (blogId: number, newStatus: boolean) => void;
    onDelete: (blogId: number) => void;
    fetchBlogs: () => Promise<void>
}

export function BlogCard({ blog, onStatusChange, onDelete, fetchBlogs }: BlogCardProps) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Track if delete dialog is open
    const [openTagDialog, setOpenTagDialog] = useState(false); // Track if delete dialog is open
    const [tag, setTag] = useState("")
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [status, setStatus] = useState(blog.isRead ? "READ" : "UNREAD");
    const [openTextDialog, setOpenTextDialog] = useState(false);
    const [openAiTextDialog, setOpenAiTextDialog] = useState(false);
    const [aiText,setAiText]=useState("")
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [openTagDeleteDialog, setOpenTagDeleteDialog] = useState(false)
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)
    }
    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            toast.error("Invalid Login, Please Login again");
            return;
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/blog/${blog.id}`,
                {
                    userId: Number(userId),
                    status: newStatus === "READ", // Convert status to boolean
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Status updated successfully!");
                setStatus(newStatus); // Update local state
                onStatusChange(blog.id, newStatus === "READ");
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            toast.error("Invalid Login, Please Login again");
            return;
        }
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/blog/${blog.id}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Blog deleted successfully!");
                onDelete(blog.id); // Remove blog from parent state
            } else {
                toast.error("Failed to delete blog.");
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog.");
        } finally {
            setIsLoading(false);
            setOpenDeleteDialog(false);
        }
    }
    const handleTag = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            toast.error("Invalid Login, Please Login again");
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/blog/tag`,
                {
                    blogId: blog.id,
                    userId: userId,
                    tagName: tag
                },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Tag added successfully!");
                fetchBlogs();

            } else {
                toast.error("Failed to delete blog.");
            }
        } catch (error) {
            console.error("Error Adding tag:", error);
            toast.error("Failed to add tag");
        } finally {
            setIsLoading(false);
            setOpenTagDialog(false);
            setTag("")
        }
    }
    const handleDeleteTag = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            toast.error("Invalid Login, Please Login again");
            return;
        }
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/delete/tag`,
                {
                    data: {
                        blogId: blog.id,
                        userId: parseInt(userId,10),
                        tagName: selectedTag
                    },
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );

            if (response.status === 200) {
                toast.success("Tag Deleted successfully!");
                fetchBlogs();

            } else {
                toast.error("Failed to delete Tag");
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
            toast.error("Failed to delete tag");
        } finally {
            setIsLoading(false);
            setOpenTagDeleteDialog(false)
            setSelectedTag('')
        }
    }
    const handleSummarize = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) {
            toast.error("Invalid Login, Please Login again");
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/summarize`,
                {
                        url:blog.url,
                },{
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setAiText(response.data.summary)
                toast.success("Successfully summarized!");
                setOpenTextDialog(false)
                setOpenAiTextDialog(true)

            } else {
                toast.error("Failed to summarize blog");
            }
        } catch (error) {
            console.error("Error summarize:", error);
            toast.error("Failed to summarize");
        } finally {
            setIsLoading(false);
            setOpenTextDialog(false)
        }
    }
    return (
        <Card className="w-full p-1 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
                <CardTitle className="flex flex-col items-start">
                    {blog.title}
                </CardTitle>
                <CardDescription className="flex flex-col items-start">
                    Added on {new Date(blog.createdAt).toLocaleDateString()}
                </CardDescription>
                {blog.isRead ? (
                    <Badge className="w-full bg-gray-400 text-white" variant="secondary">
                        <Check className="h-3 w-3" />
                        <span>Read</span>
                    </Badge>
                ) : (
                    <Badge className="w-full bg-gray-600" variant="default">
                        <span>Unread</span>
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <Button onClick={() => window.open(blog.url, '_blank')} className="w-1/6 underline m-2 text-xs text-black bg-green-400 hover:text-white"><ExternalLink /></Button>
                    <Button onClick={() => 
                        setOpenTextDialog(true)
                    } className="w-3/6  m-2 px-6 text-xs text-white bg-blue-600 hover:text-white"><Stars/>Summarize with AI</Button>
                    <Select
                        value={status}
                        onValueChange={(value) => handleStatusChange(value)}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-2/6 m-2">
                            <SelectValue placeholder="STATUS" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="READ">READ</SelectItem>
                            <SelectItem value="UNREAD">UNREAD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                {blog.tags && blog.tags.length > 0 ? (
                    <div className="flex flex-wrap overflow-hidden">
                        <div className="flex flex-row flex-wrap">
                            {blog.tags.map((tag: Tag) => {
                                // Randomly choose a color from the `colors` array
                                const randomColor = `m-1 ${colors[Math.floor(Math.random() * colors.length)]}`;
                                return (
                                    <button onClick={() => {
                                        setSelectedTag(tag.name)
                                        setOpenTagDeleteDialog(true)
                                        }} className="">
                                        <Badge key={tag.name} className={randomColor}>
                                            {tag.name}
                                        </Badge>
                                    </button>
                                );
                            })}
                            <Plus onClick={() => { setOpenTagDialog(true) }} className="m-1 hover:bg-gray-300 rounded-full" />
                            <button onClick={() => setOpenDeleteDialog(true)}>
                                <Trash2Icon className="m-1 hover:bg-gray-300 rounded text-red-700" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Plus onClick={() => { setOpenTagDialog(true) }}
                            className="m-1 hover:bg-gray-300 rounded-full" />
                        <button onClick={() => setOpenDeleteDialog(true)}>
                            <Trash2Icon className="m-1 hover:bg-gray-300 rounded text-red-700" />
                        </button>
                    </>
                )}
            </CardFooter>
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Blog</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this blog?</p>
                    <DialogFooter>
                        <Button
                            onClick={() => setOpenDeleteDialog(false)} // Close modal without deleting
                            variant="secondary"
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        {isLoading ? (
                            // Show the loading spinner when isLoading is true
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                            <Button
                                onClick={handleDelete} // Proceed with delete
                                className="bg-red-600"
                                disabled={isLoading}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openTagDialog} onOpenChange={setOpenTagDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a Tag</DialogTitle>
                    </DialogHeader>
                    <Input id="tag" value={tag} className="col-span-2" onChange={handleTagChange} />
                    <DialogFooter>
                        <Button
                            onClick={() => setOpenTagDialog(false)} // Close modal without deleting
                            variant="secondary"
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        {isLoading ? (
                            // Show the loading spinner when isLoading is true
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Button
                                onClick={handleTag} // Proceed with delete
                                className="bg-green-600"
                                disabled={isLoading}
                            >
                                Add
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={openTagDeleteDialog} onOpenChange={setOpenTagDeleteDialog}>
                <DialogContent>
                        {isLoading ? (
                            // Show the loading spinner when isLoading is true
                            <Loader2 className="animate-spin" />
                        ) : (
                            <div className="flex justify-center">
                                <Button
                                    id="tag"
                                    value={selectedTag}
                                    onClick={handleDeleteTag}
                                    className="bg-red-600 w-1/2"
                                    disabled={isLoading}
                                >
                                    Delete
                                </Button>
                            </div>

                        )}
                </DialogContent>
            </Dialog>
            <Dialog open={openTextDialog} onOpenChange={setOpenTextDialog}>
                <DialogContent>
                        <DialogHeader>Do you want to summarize this blog using AI ? </DialogHeader>
                        <Button
                            onClick={() => setOpenTagDialog(false)} // Close modal without deleting
                            variant="secondary"
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        {isLoading ? (
                            // Show the loading spinner when isLoading is true
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Button
                                onClick={handleSummarize} // Proceed with delete
                                className="bg-blue-600"
                                disabled={isLoading}
                            >
                                Sure, Do it
                            </Button>
                        )}
                </DialogContent>
            </Dialog>
            <Dialog open={openAiTextDialog} onOpenChange={setOpenAiTextDialog}>
                <DialogContent>
                        <p>{aiText}</p>
                </DialogContent>
            </Dialog>
        </Card>
    )
}