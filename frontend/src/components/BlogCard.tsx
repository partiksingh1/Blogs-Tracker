import { Blog } from "@/types/blog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCategoryMutations } from "@/api/useMutation";
import { useStateContext } from "@/lib/ContextProvider";
import toast from "react-hot-toast";

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
type BlogProps = {
    blog: Blog
}
export const BlogCard = ({ blog }: BlogProps) => {
    const { user } = useStateContext();
    const userId = user?.id;
    const { updateBlogMutation } = useCategoryMutations(userId)
    const status = blog.isRead ? "READ" : "UNREAD";
    // Handlers
    const handleStatusChange = (blogId: string, newValue: string) => {
        if (status == newValue) {
            toast.success("Status updated!")
        } else {
            if (newValue == "READ") {
                updateBlogMutation.mutateAsync({ status: true, blogId })
            } else {
                updateBlogMutation.mutateAsync({ status: false, blogId })
            }
        }
    }

    return (
        <Card className="w-full p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-100">
            <CardHeader>
                <CardTitle className="flex flex-col items-start">{blog.title}</CardTitle>
                <CardDescription className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex justify-between">
                    <Button
                        onClick={() => window.open(blog.url, "_blank")}
                        className="w-1/6 underline text-xs"
                        aria-label={`Open blog ${blog.title} in new tab`}
                    >
                        <ExternalLink />
                    </Button>
                    <Select value={status} onValueChange={(newValue) => handleStatusChange(blog.id, newValue)} aria-label="Blog read status">
                        <SelectTrigger className="w-30 ml-4">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="READ">Read</SelectItem>
                            <SelectItem value="UNREAD">Unread</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            <CardFooter>
                <div className="flex flex-wrap overflow-hidden">
                    <div className="flex flex-row flex-wrap">
                        {(blog.tags ?? []).map((tag) => (
                            <Badge key={tag.id} className={`m-1 ${getTagColor(tag.name)}`}>{tag.name}</Badge>

                        ))}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};
