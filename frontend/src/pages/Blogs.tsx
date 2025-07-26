import { BlogList } from "@/components/BlogList"
import { CreateBlog } from "@/components/Create-Blog"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch } from "@/hooks/hooks"
import { logout } from "@/store/slices/authSlice"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Blogs = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const [showIntro, setShowIntro] = useState(true);
    const handleIntroClose = () => {
        setShowIntro(false);
    };
    return (
        <div className="mx-auto max-w-screen-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center dark:bg-black rounded-xl mb-3 p-4 gap-4">
                <div className="flex gap-10 flex-wrap justify-center sm:justify-between w-full">

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="bg-red-500 text-white" onClick={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ModeToggle />
                    <CreateBlog />
                </div>
            </div>

            {/* Blog List */}
            <BlogList />

            {/* Intro Message */}
            {showIntro && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 px-4 py-3 sm:py-4 text-sm sm:text-base text-center flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 shadow-md z-50">
                    <p className="text-gray-800 dark:text-gray-200">
                        Welcome! To add a new blog/article, click the "Add Blog" button on the top-right.
                    </p>
                    <button
                        onClick={handleIntroClose}
                        className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-md text-sm">
                        Got it
                    </button>
                </div>
            )}
        </div>
    );
};
