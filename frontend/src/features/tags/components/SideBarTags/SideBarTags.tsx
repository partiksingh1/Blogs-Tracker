import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight, HashIcon } from "lucide-react";
import { useStateContext } from "@/context/AuthContext";
import { TagList } from "./TagList";
import { useTags } from "../../hooks/useTags";

export const SideBarTags = () => {
    const { user } = useStateContext();
    const userId = user?.id;
    const tagsQuery = useTags(userId);
    return (
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                    <HashIcon />
                    <span>Tags</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                {tagsQuery.isLoading ? (
                    <SidebarMenuSkeleton />
                ) : (
                    <TagList tags={tagsQuery.data?.data.tags} />
                )}
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
