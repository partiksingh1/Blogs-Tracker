import { ChevronUp } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { useStateContext } from "@/lib/ContextProvider";
import { SideBarCategory } from "./SideBarCategory/SideBarCategory";
import { Collapsible } from "@radix-ui/react-collapsible";
import { SideBarTags } from "./SideBarTags/SideBarTags";

export function AppSidebar() {
    const navigate = useNavigate();
    const { logout } = useStateContext()
    const handleLogout = () => {
        logout()
        navigate("/");
    };
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* home */}
                            {/* <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => navigate("/home")}>
                                    <HomeIcon />
                                    <span>Home</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}

                            {/* Categories */}
                            <Collapsible defaultOpen className="group/collapsible">
                                <SideBarCategory />
                            </Collapsible>
                            {/* Tags */}
                            <Collapsible defaultOpen className="group/collapsible">
                                <SideBarTags />
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    {/* <User2 /> {username} */}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}