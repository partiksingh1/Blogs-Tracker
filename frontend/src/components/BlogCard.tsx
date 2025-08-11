import { Blog, Tag } from "@/types/blog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Loader2, Plus, Stars, Trash2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "./ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCallback, useState, memo } from "react";
import axios from "axios";
import { getAuthFromStore } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addTagToBlog, removeTagFromBlog } from "@/store/thunks";

const colors = [
    "bg-red-600", "bg-red-700", "bg-red-800",
    "bg-blue-600", "bg-blue-700", "bg-blue-800",
    "bg-green-600", "bg-green-700", "bg-green-800",
    "bg-yellow-500", "bg-yellow-600", "bg-yellow-700",
    "bg-purple-600", "bg-purple-700", "bg-purple-800",
    "bg-pink-500", "bg-pink-600", "bg-pink-700",
    "bg-orange-500", "bg-orange-600", "bg-orange-700",
    "bg-teal-500", "bg-teal-600", "bg-teal-700",
    "bg-indigo-600", "bg-indigo-700", "bg-indigo-800",
    "bg-gray-600", "bg-gray-700", "bg-gray-800",
    "bg-cyan-500", "bg-cyan-600", "bg-cyan-700",
    "bg-lime-600", "bg-lime-700", "bg-lime-800",
    "bg-amber-500", "bg-amber-600", "bg-amber-700",
];

// Utility to generate deterministic color based on tag name
function getTagColor(tagName: string): string {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

interface BlogCardProps {
    blog: Blog;
    onStatusChange: (blogId: string, newStatus: boolean) => void;
    onDelete: (blogId: string) => void;
}

// Dialog types for unified dialog state
type DialogType = "delete" | "addTag" | "deleteTag" | "summarize" | "aiText" | null;

function DeleteDialog({
    isOpen,
    onClose,
    onDelete,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    isLoading: boolean;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Blog</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this blog?</p>
                <DialogFooter>
                    <Button onClick={onClose} variant="secondary" className="mr-2">
                        Cancel
                    </Button>
                    <Button onClick={onDelete} className="bg-red-600" disabled={isLoading} aria-label="Confirm delete blog">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AddTagDialog({
    isOpen,
    onClose,
    onAddTag,
    isLoading,
    tag,
    setTag,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAddTag: () => void;
    isLoading: boolean;
    tag: string;
    setTag: (tag: string) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Tag</DialogTitle>
                </DialogHeader>
                <Input
                    id="tag"
                    value={tag}
                    className="col-span-2"
                    onChange={(e) => setTag(e.target.value)}
                    aria-label="Tag name"
                    autoFocus
                />
                <DialogFooter>
                    <Button onClick={onClose} variant="secondary" className="mr-2">
                        Cancel
                    </Button>
                    <Button
                        onClick={onAddTag}
                        className={`bg-green-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLoading}
                        aria-label="Add tag"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteTagDialog({
    isOpen,
    onClose,
    onDeleteTag,
    isLoading,
    selectedTag,
}: {
    isOpen: boolean;
    onClose: () => void;
    onDeleteTag: () => void;
    isLoading: boolean;
    selectedTag: string;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <p>Delete tag "{selectedTag}"?</p>
                <div className="flex justify-center">
                    <Button
                        onClick={onDeleteTag}
                        className="bg-red-600 w-1/2"
                        disabled={isLoading}
                        aria-label={`Delete tag ${selectedTag}`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function SummarizeDialog({
    isOpen,
    onClose,
    onSummarize,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSummarize: () => void;
    isLoading: boolean;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Do you want to summarize this blog using AI?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="secondary" className="mr-2" aria-label="Cancel summarization">
                        Cancel
                    </Button>
                    <Button
                        onClick={onSummarize}
                        className={`bg-blue-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLoading}
                        aria-label="Confirm AI summarization"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Sure, Do it"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AiTextDialog({
    isOpen,
    onClose,
    aiText,
}: {
    isOpen: boolean;
    onClose: () => void;
    aiText: string;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <p>{aiText}</p>
            </DialogContent>
        </Dialog>
    );
}

export const BlogCard = memo(function BlogCard({
    blog,
    onStatusChange,
    onDelete,
}: BlogCardProps) {
    const dispatch = useAppDispatch();
    const { isLoading, isTagLoading } = useAppSelector((state) => state.blog);

    // Unified dialog state
    const [openDialog, setOpenDialog] = useState<DialogType>(null);

    // Tag states
    const [tag, setTag] = useState("");
    const [selectedTag, setSelectedTag] = useState<string>("");

    // Local status derived from blog prop to avoid stale state
    const status = blog.isRead ? "READ" : "UNREAD";

    // Handlers
    const handleStatusChange = useCallback(
        async (newStatus: string) => {
            try {
                onStatusChange(blog.id, newStatus === "READ");
                toast.success("Status updated successfully!");
            } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Failed to update status.");
            }
        },
        [onStatusChange, blog.id]
    );

    const handleDelete = useCallback(async () => {
        try {
            onDelete(blog.id);
            toast.success("Blog deleted successfully!");
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error("Failed to delete blog.");
        } finally {
            setOpenDialog(null);
        }
    }, [onDelete, blog.id]);

    const handleAddTag = useCallback(async () => {
        if (!tag.trim()) {
            toast.error("Tag cannot be empty.");
            return;
        }
        try {
            await dispatch(addTagToBlog({ blogId: blog.id, tagName: tag.trim() }));
            toast.success("Tag added successfully!");
            setTag("");
        } catch (error) {
            console.error("Error adding tag:", error);
            toast.error("Failed to add tag.");
        } finally {
            setOpenDialog(null);
        }
    }, [dispatch, blog.id, tag]);

    const handleDeleteTag = useCallback(async () => {
        if (!selectedTag) return;
        try {
            await dispatch(removeTagFromBlog({ blogId: blog.id, tagName: selectedTag }));
            toast.success("Tag deleted successfully!");
        } catch (error) {
            console.error("Error deleting tag:", error);
            toast.error("Failed to delete tag.");
        } finally {
            setSelectedTag("");
            setOpenDialog(null);
        }
    }, [dispatch, blog.id, selectedTag]);

    const [aiText, setAiText] = useState("");

    const handleSummarize = useCallback(async () => {
        const auth = getAuthFromStore();
        if (!auth) {
            toast.error("You must be logged in to summarize.");
            setOpenDialog(null);
            return;
        }
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/summarize`,
                { url: blog.url },
                { headers: { Authorization: `${auth.token}` } }
            );
            if (response.status === 200) {
                setAiText(response.data.summary);
                toast.success("Successfully summarized!");
                setOpenDialog("aiText");
            } else {
                toast.error("Failed to summarize blog.");
            }
        } catch (error) {
            console.error("Error summarizing:", error);
            toast.error("Failed to summarize.");
        } finally {
            if (openDialog === "summarize") setOpenDialog(null);
        }
    }, [blog.url, openDialog]);

    // No need for effect to refetch blogs here; redux thunk actions update store on success

    return (
        <Card className="w-full p-1 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
                <CardTitle className="flex flex-col items-start">{blog.title}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </span>

                    <Select value={status} onValueChange={handleStatusChange} disabled={isLoading} aria-label="Blog read status">
                        <SelectTrigger className="w-[120px] ml-4">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="READ">Read</SelectItem>
                            <SelectItem value="UNREAD">Unread</SelectItem>
                        </SelectContent>
                    </Select>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex justify-between">
                    <Button
                        onClick={() => window.open(blog.url, "_blank")}
                        className="w-1/6 underline text-xs text-black bg-green-400 hover:text-white"
                        aria-label={`Open blog ${blog.title} in new tab`}
                    >
                        <ExternalLink />
                    </Button>
                    <Button
                        onClick={() => setOpenDialog("summarize")}
                        className="w-3/6 text-xs text-white bg-blue-600 hover:text-white"
                        aria-label="Summarize blog using AI"
                    >
                        <Stars />
                        <span className="block sm:hidden">AI</span>
                        <span className="hidden sm:inline">Summarize with AI</span>
                    </Button>
                </div>
            </CardContent>

            <CardFooter>
                <div className="flex flex-wrap overflow-hidden">
                    <div className="flex flex-row flex-wrap">
                        {(blog.tags ?? []).map((tag: Tag) => (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedTag(tag.name);
                                    setOpenDialog("deleteTag");
                                }}
                                key={tag.name}
                                className="m-1"
                                aria-label={`Delete tag ${tag.name}`}
                            >
                                <Badge className={` ${getTagColor(tag.name)}`}>{tag.name}</Badge>
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setOpenDialog("addTag")}
                            className="m-1 hover:bg-gray-300 rounded-full"
                            aria-label="Add tag"
                        >
                            <Plus />
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpenDialog("delete")}
                            className="m-1 hover:bg-gray-300 rounded text-red-700"
                            aria-label="Delete blog"
                        >
                            <Trash2Icon />
                        </button>
                    </div>
                </div>
            </CardFooter>

            {/* Dialogs */}
            <DeleteDialog
                isOpen={openDialog === "delete"}
                onClose={() => setOpenDialog(null)}
                onDelete={handleDelete}
                isLoading={isLoading}
            />
            <AddTagDialog
                isOpen={openDialog === "addTag"}
                onClose={() => setOpenDialog(null)}
                onAddTag={handleAddTag}
                isLoading={isTagLoading}
                tag={tag}
                setTag={setTag}
            />
            <DeleteTagDialog
                isOpen={openDialog === "deleteTag"}
                onClose={() => setOpenDialog(null)}
                onDeleteTag={handleDeleteTag}
                isLoading={isTagLoading}
                selectedTag={selectedTag}
            />
            <SummarizeDialog
                isOpen={openDialog === "summarize"}
                onClose={() => setOpenDialog(null)}
                onSummarize={handleSummarize}
                isLoading={isLoading}
            />
            <AiTextDialog
                isOpen={openDialog === "aiText"}
                onClose={() => setOpenDialog(null)}
                aiText={aiText}
            />
        </Card>
    );
});
