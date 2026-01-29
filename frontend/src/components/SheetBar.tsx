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
import { QueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { Card, CardAction, CardDescription, CardHeader } from "./ui/card";
import ReactMarkdown from "react-markdown";
interface SheetBarProps {
    blog: Blog
}
export function SheetBar({ blog }: SheetBarProps) {
    const queryClient = new QueryClient();
    const [isAddTagOpen, setIsAddTagOpen] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [summary, setSummary] = useState("")
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const { user } = useStateContext();
    const userId = user?.id;
    const { addTagMutation, deleteTagMutation, deleteBlogMutation, sumamryMutation } = useCategoryMutations(userId);
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
    const handleTagDelete = async (tagId: string, blogId: string) => {
        deleteTagMutation.mutate({ tagId, blogId });
    }
    const handleBlogDelete = async (blogId: string) => {
        deleteBlogMutation.mutate(blogId)
    }
    return (
        <>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{blog.title}</SheetTitle>
                    <SheetDescription>
                        {blog.url}
                    </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                        <Button className="cursor-pointer" onClick={() => {
                            window.open(blog.url, "_blank")
                        }}>Visit Link</Button>
                    </div>
                    <div className="grid gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-blue-600 cursor-pointer">Summarize</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Are you sure you want summarize this blog using AI?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer" size="sm" variant="outline">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleSummary(blog.url)} type="submit" className="cursor-pointer" size="sm">Sure</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="sheet-demo-username">Category :
                            <p className="bg-black text-white p-2 rounded-md">sdffs</p>
                        </Label>
                        <Label>Added on :
                            <p className="p-1 rounded-md">{blog.createdAt.substring(0, 10)}</p>
                        </Label>
                        <Label className="mt-2">Tags:</Label>

                        <div className="flex flex-wrap gap-2">
                            {blog.tags?.map((tag, index) => (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        {/* <Button variant="destructive">Delete Chat</Button> */}
                                        <Badge className="cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black">{tag.name}</Badge>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent size="sm">
                                        <AlertDialogHeader>
                                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                                <Trash2Icon />
                                            </AlertDialogMedia>
                                            <AlertDialogTitle>Delete {tag.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete the tag with name - {tag.name}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="cursor-pointer" size="sm" variant="outline">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => { handleTagDelete }} className="cursor-pointer" size="sm" variant="destructive">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ))}
                            <div>
                                {
                                    isAddTagOpen ? (
                                        <div className="flex justify-center items-center gap-2">
                                            <Input className="p-4" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Write a Tag here" disabled={addTagMutation.isPending} />
                                            {addTagMutation.isPending ? (
                                                <Loader2 className="animate-spin" size={30} />
                                            ) : (
                                                <CheckIcon
                                                    className="cursor-pointer"
                                                    size={30}
                                                    onClick={() => handleTagSubmit(blog.id)}
                                                />
                                            )}

                                            <X className="cursor-pointer" size={"30"} onClick={() => setIsAddTagOpen(false)} />
                                        </div>

                                    ) : (
                                        <Button variant="secondary" size="default" className="cursor-pointer bg-white text-black border-dotted border-2" onClick={() => setIsAddTagOpen(true)}>Add Tag</Button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            {/* <Button variant="destructive">Delete Chat</Button> */}
                            <Button className="bg-red-500 cursor-pointer">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <Trash2Icon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>Delete?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this blog?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer" size="sm" variant="outline">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBlogDelete(blog.id)} type="submit" className="cursor-pointer" size="sm" variant="destructive">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <SheetClose asChild>
                        <Button variant="outline" className="cursor-pointer">Close</Button>
                    </SheetClose>
                </SheetFooter>


            </SheetContent>
            {/* Modal overlay */}
            {showSummaryModal && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <Card className="flex mx-auto w-1/2 h-fit">
                        <CardAction className="flex w-full justify-end cursor-pointer" onClick={() => { setShowSummaryModal(false); setSummary(""); }}>
                            <X className="mr-8 bg-gray-300 rounded-4xl p-1" />
                        </CardAction>
                        <CardHeader>
                            <CardDescription className="">
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            )}
        </>
    )
}
