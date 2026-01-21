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
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast";;
import { CategorySelect } from "./CategorySelection";
import { Button } from "@/components/ui/button";
import { useCategoryMutations } from "@/api/useMutation";
import { useStateContext } from "@/lib/ContextProvider";

export const CreateBlog = () => {
    const { user } = useStateContext();
    const userId = user?.id;
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [category, setCategory] = useState("");
    const [isRead, setIsRead] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

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
        return true;
    };

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setCategory("");
        setIsRead(false);
    };
    const { addBlogMutation } = useCategoryMutations(userId);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            addBlogMutation.mutateAsync({ url, title, isRead, categoryName: category }).then(() => resetForm())
        } catch (error) {

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
                                disabled={addBlogMutation.isPending}
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
                                disabled={addBlogMutation.isPending}
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
                                disabled={addBlogMutation.isPending}
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={addBlogMutation.isPending} aria-busy={addBlogMutation.isPending}>
                            {addBlogMutation.isPending ? (
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
