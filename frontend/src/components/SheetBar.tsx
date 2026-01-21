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
import { Loader2 } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider"
import { Blog } from "@/types/blog"
import { CheckIcon, X } from "lucide-react"
import { useState } from "react"
import { useCategoryMutations } from "../api/useMutation"
import { QueryClient } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
interface SheetBarProps {
    blog: Blog
}
export function SheetBar({ blog }: SheetBarProps) {
    const queryClient = new QueryClient();
    console.log("blogs ", blog)
    const [isAddTagOpen, setIsAddTagOpen] = useState(false)
    const [newTag, setNewTag] = useState("")
    const { user } = useStateContext();
    const userId = user?.id;
    const { addTagMutation, deleteTagMutation } = useCategoryMutations(userId);
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
    const handleDelete = async (tagId: string, blogId: string) => {
        if (!confirm("Are you sure you want to delete this tag?")) return;
        deleteTagMutation.mutate({ tagId, blogId });
    }
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{blog.title}</SheetTitle>
                <SheetDescription>
                    {blog.url}
                </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                    <Button>Visit Link</Button>
                </div>
                <div className="grid gap-3">
                    <Button className="bg-blue-600">Summarize</Button>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-username">Category :
                        <p className="bg-black text-white p-2 rounded-md">sdffs</p>
                    </Label>
                    <Label>Added on :
                        <p className=" p-1 rounded-md">{blog.createdAt.substring(0, 10)}</p>
                    </Label>
                    <Label>Tags:</Label>

                    <div className="flex flex-wrap gap-2">
                        {blog.tags?.map((tag, index) => (
                            <Badge
                                key={index}
                                onClick={() => handleDelete(tag.id, blog.id)}
                                className="bg-sky-700 px-2 py-1 rounded-md text-sm justify-center items-center cursor-pointer"
                            >
                                {tag.name}
                            </Badge>
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
                                    <Button className="cursor-pointer" onClick={() => setIsAddTagOpen(true)}>Add Tag</Button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <SheetFooter className="">
                <Button type="submit">Delete</Button>
                <SheetClose asChild>
                    <Button variant="outline" className="">Close</Button>
                </SheetClose>
            </SheetFooter>


        </SheetContent>
    )
}
