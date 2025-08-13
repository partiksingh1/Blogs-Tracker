import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";;
import { CategorySelect } from "./CategorySelection";
import { Button } from "@/components/ui/button";

export const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };
    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setIsRead(e.target.value === "true");
    };

    const validateForm = () => {
        if (!title.trim()) {
            toast.error("Title is required");
            return false;
        }
        try {
            new URL(url);
        } catch {
            toast.error("Please enter a valid URL");
            return false;
        }
        if (!category.trim()) {
            toast.error("Please select a category");
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setCategory("");
        setIsRead(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/add`, {
                title,
                url,
                categoryName: category.toLowerCase(),
                isRead,
                userId
            },
                {
                    headers: {
                        Authorization: `${token}`,  // Pass the token in the Authorization header
                    },
                }).then(() => {
                    toast.success("Blog added successfully!");
                    resetForm();
                    setDialogOpen(false);
                })
        } catch (error: unknown) {
            console.error("Error adding blog:", error);
            toast.error("Error adding blog :(");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    ADD BLOG
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a new blog</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                className="col-span-3"
                                onChange={handleTitleChange}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input
                                id="url"
                                name="url"
                                value={url}
                                className="col-span-3"
                                onChange={handleUrlChange}
                                disabled={loading}
                                required
                                type="url"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <CategorySelect
                                id="category"
                                value={category}
                                onChange={setCategory}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isRead" className="text-right">
                                Is Read?
                            </Label>
                            <select
                                id="isRead"
                                name="isRead"
                                value={isRead.toString()}
                                onChange={handleDropdownChange}
                                className="col-span-3"
                                aria-label="Mark blog as read or unread"
                                disabled={loading}
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} aria-busy={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                                    Submitting...
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
