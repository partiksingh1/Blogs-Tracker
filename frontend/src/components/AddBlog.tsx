import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChangeEvent, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";;
import { getAuthFromStore } from "@/lib/auth";
import { CategorySelect } from "./CategorySelection";
import { createBlog } from "@/store/thunks";
import { useAppDispatch } from "@/hooks/hooks";
import { debounce } from "lodash";

export const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const dispatch = useAppDispatch();

    // Debounced fetchBlogInfo to avoid multiple calls while typing
    const fetchBlogInfo = useCallback(
        debounce(async (inputUrl: string) => {
            const auth = getAuthFromStore();
            if (!auth) return;
            const { token } = auth;
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/fetchContent`,
                    { url: inputUrl },
                    { headers: { Authorization: `${token}` } }
                );

                if (response.data?.data?.title) {
                    setTitle(response.data.data.title);
                }
            } catch (error: any) {
                console.error("Error fetching blog info:", error?.message ?? error);
                toast.error("Could not fetch blog details.");
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            fetchBlogInfo(url);
        }
    }, [url, fetchBlogInfo]);

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
            const action = await dispatch(
                createBlog({
                    title,
                    url,
                    categoryName: category.toLowerCase(),
                    isRead,
                })
            );

            if (createBlog.fulfilled.match(action)) {
                toast.success("Blog added successfully!");
                resetForm();
                setDialogOpen(false);
                // Optionally, you could trigger a refresh or fetch blogs here instead of navigate(0)
            } else {
                toast.error(
                    (action.payload as string) || "Error adding blog :("
                );
            }
        } catch (error: any) {
            console.error("Error adding blog:", error?.message ?? error);
            toast.error("Error adding blog :(");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    className="border-black"
                    variant="outline"
                    aria-haspopup="dialog"
                >
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
