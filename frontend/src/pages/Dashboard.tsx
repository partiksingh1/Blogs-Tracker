import { CreateBlog } from "@/components/AddBlog";
import { BlogList } from "@/components/BlogList";
import { ManageCategories } from "@/components/ManageCategories";
import { ModeToggle } from "@/components/ToggleTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearAuthToken } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();
    const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    useEffect(() => {
        if (!user || !token) {
            navigate("/");
        }
    }, [user, token, navigate]);

    const handleLogout = () => {
        clearAuthToken();
        navigate("/login");
    };

    return (
        <div className="mx-auto max-w-screen-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center dark:bg-black rounded-xl mb-3 p-4 gap-4">
                <div className="flex gap-10 flex-wrap justify-center sm:justify-between w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
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
                    <Button className="bg-white text-black outline dark:bg-black dark:text-white" onClick={() => setIsManageCategoriesOpen(true)}>Manage Categories</Button>
                    <CreateBlog />
                </div>
            </div>

            {/* Blog List */}
            <BlogList />
            {/* Manage Categories Dialog */}
            {isManageCategoriesOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-2">
                        <ManageCategories onClose={() => setIsManageCategoriesOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};
