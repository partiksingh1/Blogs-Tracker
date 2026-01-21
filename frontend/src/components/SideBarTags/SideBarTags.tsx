// SideBarCategory/SideBarCategory.tsx
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Folder, ChevronRight } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { useTags } from "../../api/useTags";
import { TagList } from "./TagList";

export const SideBarTags = () => {
    const { user } = useStateContext();
    const userId = user?.id;

    const tagsQuery = useTags(userId);
    // const { addCategory } = useCategoryMutations(userId);

    if (tagsQuery.isLoading) return false;

    return (
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                    <Folder />
                    <span>Tags</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <TagList
                    tags={tagsQuery.data.tags}
                // onAdd={(name: any) => addCategory.mutate(name)}
                // isAdding={addCategory.isPending}
                />
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
