import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { ChangeEvent, useState } from "react"
import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"
import { getAuthFromStore } from "@/lib/auth"
import { CategorySelect } from "./CategorySelection"
import { createBlog } from "@/store/thunks"
import { useAppDispatch } from "@/hooks/hooks"
export const CreateBlog = () => {
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [category, setCategory] = useState("")
    const [isRead, setIsRead] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);

        const isValidUrl = inputUrl.startsWith("http://") || inputUrl.startsWith("https://");

        if (isValidUrl) {
            fetchBlogInfo(inputUrl);
        }
    };
    const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setIsRead(e.target.value === "true")
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const action = await dispatch(createBlog({
                title,
                url,
                categoryName: category.toLowerCase(),
                isRead,
            }));
            if (createBlog.fulfilled.match(action)) {
                toast.success("Blog added successfully!");
                setTitle("");
                setUrl("");
                setCategory("");
                navigate(0);
            } else {
                toast.error(action.payload as string || "Error adding Blog :(");
            }
        } catch (error) {
            console.error("Error adding blog:", error);
            toast.error("Error adding Blog :(");
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogInfo = async (inputUrl: string) => {

        const auth = getAuthFromStore();
        if (!auth) return;
        const { token } = auth;
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/fetchContent`, {
                url: inputUrl
            }, {
                headers: {
                    "Authorization": `${token}`
                }
            });

            if (response.data) {
                const { title } = response.data.data || {};
                if (title) setTitle(title);
            }
        } catch (error) {
            console.error("Error fetching blog info:", error);
            toast.error("Could not fetch blog details.");
        }
    };


    if (loading) {
        return (
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="border-black" variant="outline">ADD BLOG</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a new blog</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="title" value={title} className="col-span-3" onChange={handleTitleChange} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                                URL
                            </Label>
                            <Input id="url" value={url} className="col-span-3" onChange={handleUrlChange} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <CategorySelect onChange={setCategory} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Is Read?
                            </Label>
                            <select id="isRead" value={isRead.toString()} onChange={handleDropdownChange} className="col-span-3">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
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

    )
}