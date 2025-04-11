import { BlogList } from "@/components/BlogList"
import { CreateBlog } from "@/components/Create-Blog"
import { ModeToggle } from "@/components/mode-toggle"
// import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Blogs = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("userId")
        navigate("/login")
    }
    const [showIntro, setShowIntro] = useState(true); // State to track if intro is shown
    const handleIntroClose = () => {
        setShowIntro(false);
    }
    const username = localStorage.getItem("username")
    let heading = username?.toUpperCase();
    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center bg-gray-200 dark:bg-black rounded-xl mb-3 p-2">
                <h1 className="text-sm md:text-4xl font-bold ml-2"><span className="underline text-4xl">{heading}’s</span> &nbsp; Blog Zone!</h1>
                <div className="flex items-center">
                    <div className="m-2.5">
                        <ModeToggle />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="m-2">
                            <Avatar className="m-2">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                            <DropdownMenuItem className="bg-red-500 text-white" onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button className="m-2.5 bg-gray-800 border-2 border-white dark:bg-white dark:border-black">ADD BLOG</Button> */}
                    <CreateBlog />
                </div>
            </div>
            <BlogList />
            {/* Intro Message */}
            {showIntro && (
                <div className="fixed bottom-0 left-0 right-0 bg-transparent p-4 text-center flex justify-center items-center">
                    <p className="mr-4">Welcome to your blog zone! To add a new blog, click the "Add Blog" button on the top-right of the screen.</p>
                    <button
                        onClick={handleIntroClose}
                        className="bg-black dark:bg-white dark:text-black text-white p-1 rounded">
                        Got it
                    </button>
                </div>

            )}
        </div>

    )
}
