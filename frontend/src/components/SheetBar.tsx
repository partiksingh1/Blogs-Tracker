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
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2Icon } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider"
import { Blog } from "@/types/blog"
import { CheckIcon, X } from "lucide-react"
import { useState } from "react"
import { useCategoryMutations } from "../api/useMutation"
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "./ui/card";
import ReactMarkdown from "react-markdown";
interface SheetBarProps {
    blog: Blog
}
export function SheetBar({ blog }: SheetBarProps) {
    const queryClient = useQueryClient();
    const [isAddTagOpen, setIsAddTagOpen] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [summary, setSummary] = useState("")
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const { user } = useStateContext();
    const userId = user?.id;
    const { addTagMutation, deleteTagMutation, deleteBlogMutation, sumamryMutation, addCategoryToBlogMutation } = useCategoryMutations(userId);
    const handleTagSubmit = (blogId: string) => {
        if (!newTag.trim()) return;
        addTagMutation.mutate({ newTag, blogId }, {
            onSuccess: () => {
                setNewTag("");
                setIsAddTagOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ["getBlogs", blogId]
                })
            }
        });
    }
    const handleSummary = async (url: string) => {
        sumamryMutation.mutate(url, {
            onSuccess: (data) => {
                console.log("sum data is ", data)
                setSummary(data.summary)
                setShowSummaryModal(true);
            }
        })

    }
    const handleCategorySubmit = () => {
        if (!newCategory.trim()) return;

        addCategoryToBlogMutation.mutate(
            {
                blogId: blog.id,
                categoryName: newCategory
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
        deleteTagMutation.mutate({ tagId, blogId });
    }
    const handleBlogDelete = async (blogId: string) => {
        deleteBlogMutation.mutate(blogId)
    }
    return (
        <>
            <SheetContent className="flex flex-col h-full overflow-y-auto">
                <SheetHeader className="space-y-2">
                    <SheetTitle className="text-lg md:text-xl break-words">
                        {blog.title}
                    </SheetTitle>
                    <SheetDescription className="break-all text-sm text-muted-foreground">
                        {blog.url}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-6 px-2 md:px-4 py-4 flex-1">

                    {/* Visit */}
                    <Button
                        className="w-full"
                        onClick={() => window.open(blog.url, "_blank")}
                    >
                        Visit Link
                    </Button>

                    {/* Summarize */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full bg-blue-600">
                                Summarize
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-sm">
                            <AlertDialogHeader>
                                <AlertDialogDescription>
                                    Are you sure you want to summarize this blog using AI?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleSummary(blog.url)}
                                    className="w-full sm:w-auto"
                                >
                                    Sure
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

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
                                        disabled={addCategoryToBlogMutation.isPending}
                                        className="flex-1"
                                    />

                                    <div className="flex gap-2">
                                        {addCategoryToBlogMutation.isPending ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <CheckIcon
                                                className="cursor-pointer"
                                                size={20}
                                                onClick={handleCategorySubmit}
                                            />
                                        )}
                                        <X
                                            className="cursor-pointer"
                                            size={20}
                                            onClick={() => setIsAddCategoryOpen(false)}
                                        />
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
                                                onClick={() =>
                                                    handleTagDelete(tag.id, blog.id)
                                                }
                                                className="w-full sm:w-auto"
                                            >
                                                Remove
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
                                    disabled={addTagMutation.isPending}
                                    className="flex-1"
                                />

                                <div className="flex gap-2">
                                    {addTagMutation.isPending ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <CheckIcon
                                            className="cursor-pointer"
                                            size={20}
                                            onClick={() =>
                                                handleTagSubmit(blog.id)
                                            }
                                        />
                                    )}
                                    <X
                                        className="cursor-pointer"
                                        size={20}
                                        onClick={() => setIsAddTagOpen(false)}
                                    />
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
                <SheetFooter className="mt-auto flex-col sm:flex-row gap-2">
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
                                    onClick={() => handleBlogDelete(blog.id)}
                                    className="w-full sm:w-auto"
                                >
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
