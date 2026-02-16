import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext"
import { Blog } from "@/types/blog"
import { CheckIcon, X } from "lucide-react"
import { useState } from "react"
import { useBlogMutations } from "../hooks/useBlogMutations"
import { useTagMutations } from "@/features/tags/hooks/useTagMutations"
import { useCategoryMutations } from "@/features/categories/hooks/useCategoryMutations"
import { Badge } from "../../../components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "../../../components/ui/card";
import ReactMarkdown from "react-markdown";
interface SheetBarProps {
    blog: Blog
}
export function SheetBar({ blog }: SheetBarProps) {
    const [isAddTagOpen, setIsAddTagOpen] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [summary, setSummary] = useState("")
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);

    const { user } = useAuthContext();
    const userId = user?.id as string;
    const { removeBlog, summarize } = useBlogMutations(userId);
    const { addTag, removeTagFromBlog } = useTagMutations(userId);
    const { assignCategoryToBlog } = useCategoryMutations(userId);

    const handleTagSubmit = (blogId: string) => {
        if (!newTag.trim()) return;
        addTag.mutate(
            {
                blogId,
                tagName: newTag,
            },
            {
                onSuccess: () => {
                    setNewTag("");
                    setIsAddTagOpen(false);
                },
            }
        );

    }
    const handleSummary = async (url: string) => {
        summarize.mutate(url, {
            onSuccess: (data: any) => {
                setSummary(data?.summary)
                setShowSummaryModal(true);
            }
        })

    }
    const handleCategorySubmit = () => {
        if (!newCategory.trim()) return;

        assignCategoryToBlog.mutate(
            {
                blogId: blog.id,
                name: newCategory,
            },

            {
                onSuccess: () => {
                    setNewCategory("");
                    setIsAddCategoryOpen(false);
                }
            }
        );
    };

    const handleTagDelete = async (tagId: string, blogId: string) => {
        setTagToDelete(tagId);
        removeTagFromBlog.mutate(
            { tagId, blogId },
            {
                onSettled: () => setTagToDelete(null),
            }
        );

    }
    const handleBlogDelete = async (blogId: string) => {
        removeBlog.mutate(blogId)
    }
    return (
        <>
            <SheetContent className="flex flex-col h-full w-full sm:max-w-md p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-lg md:text-xl wrap-break-words leading-tight">
                        {blog.title}
                    </SheetTitle>
                    <SheetDescription className="break-all text-sm text-muted-foreground line-clamp-2">
                        {blog.url}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(blog.url, "_blank")}
                        >
                            Visit Link
                        </Button>

                        {/* Summarize */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Summarize
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-sm">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Generate Summary</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to summarize this blog using AI? This might take a few seconds.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="w-full sm:w-auto">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent closing immediately
                                            handleSummary(blog.url);
                                        }}
                                        disabled={summarize.isPending}
                                        className="w-full sm:w-auto"
                                    >
                                        {summarize.isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                        Sure
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>

                        <div className="flex flex-wrap items-center gap-2">
                            {blog?.category?.name && !isAddCategoryOpen && (
                                <Badge className="px-3 py-1">
                                    {blog.category.name}
                                </Badge>
                            )}

                            {isAddCategoryOpen ? (
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <Input
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="Enter category"
                                        disabled={assignCategoryToBlog.isPending}
                                        className="flex-1"
                                    />

                                    <div className="flex items-center gap-2 h-10">
                                        {assignCategoryToBlog.isPending ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleCategorySubmit}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition"
                                            >
                                                <CheckIcon size={16} />
                                            </button>

                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setIsAddCategoryOpen(false)}
                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setIsAddCategoryOpen(true)}
                                >
                                    {blog?.category ? "Change" : "Add"} Category
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-1">
                        <Label>Added on</Label>
                        <p className="text-sm text-muted-foreground">
                            {blog.createdAt.substring(0, 10)}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <Label>Tags</Label>

                        <div className="flex flex-wrap gap-2">
                            {blog.tags?.map((tag) => (
                                <AlertDialog key={tag.id}>
                                    <AlertDialogTrigger asChild>
                                        <Badge className="cursor-pointer hover:scale-105 transition">
                                            {tag.name}
                                        </Badge>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-sm">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Remove {tag.name}?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to remove this tag?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel className="w-full sm:w-auto">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                disabled={tagToDelete === tag.id}
                                                onClick={() =>
                                                    handleTagDelete(tag.id, blog.id)
                                                }
                                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                                            >
                                                {tagToDelete === tag.id ? <Loader2 className="animate-spin mr-2" size={16} /> : "Remove"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ))}
                        </div>

                        {/* Add Tag */}
                        {isAddTagOpen ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Write a tag"
                                    disabled={addTag.isPending}
                                    className="flex-1"
                                />

                                <div className="flex items-center gap-2 h-10">
                                    {addTag.isPending ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleTagSubmit(blog.id)}
                                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition"
                                        >
                                            <CheckIcon size={16} />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setIsAddTagOpen(false)}
                                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                className="border-dashed w-fit"
                                onClick={() => setIsAddTagOpen(true)}
                            >
                                Add Tag
                            </Button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <SheetFooter className="p-6 border-t mt-auto flex-col sm:flex-row gap-2 sm:justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-red-500">
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-sm">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete blog?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={removeBlog.isPending}
                                    onClick={() => handleBlogDelete(blog.id)}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                                >
                                    {removeBlog.isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <SheetClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>

            {/* Modal overlay */}
            {showSummaryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
                        <CardAction
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => {
                                setShowSummaryModal(false);
                                setSummary("");
                            }}
                        >
                            <X />
                        </CardAction>

                        <CardHeader>
                            <CardDescription className="prose prose-sm md:prose-base max-w-none">
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            )}

        </>
    )
}
