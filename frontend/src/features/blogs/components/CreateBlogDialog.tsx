import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

import { useStateContext } from "@/context/AuthContext";
import { useBlogMutations } from "../hooks/useBlogMutations";
import { CategorySelect } from "@/features/categories/components/CategorySelection";

export const CreateBlogDialog = () => {
    const { user } = useStateContext();
    const userId = user?.id;

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { addBlog } = useBlogMutations(userId!);

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

        if (!validateForm() || !userId) return;

        try {
            await addBlog.mutateAsync({
                url,
                title,
                isRead,
                categoryName: category,
                userId,
            });

            resetForm();
            setDialogOpen(false);
        } catch (error) {
            toast.error("Failed to add blog");
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add Blog</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add a new blog</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                className="col-span-3"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTitle(e.target.value)
                                }
                                disabled={addBlog.isPending}
                                required
                            />
                        </div>

                        {/* URL */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input
                                id="url"
                                type="url"
                                value={url}
                                className="col-span-3"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setUrl(e.target.value)
                                }
                                disabled={addBlog.isPending}
                                required
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Category</Label>
                            <CategorySelect
                                value={category}
                                onChange={setCategory}
                            />
                        </div>

                        {/* Read Status */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Is Read?</Label>
                            <Select
                                value={isRead.toString()}
                                onValueChange={(value) =>
                                    setIsRead(value === "true")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Mark as Read / Unread" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="true">Read</SelectItem>
                                        <SelectItem value="false">Unread</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={addBlog.isPending}
                            aria-busy={addBlog.isPending}
                        >
                            {addBlog.isPending ? (
                                <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
