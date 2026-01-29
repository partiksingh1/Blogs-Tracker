import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronRight, HashIcon } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { TagList } from "./TagList";
import { useTags } from "@/api/useQueries";

export const SideBarTags = () => {
    const { user, token } = useStateContext();
    const userId = user?.id;

    const tagsQuery = useTags(userId, token as string);
    if (tagsQuery.isLoading) return false;

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
                <TagList
                    tags={tagsQuery.data?.tags}
                />
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
