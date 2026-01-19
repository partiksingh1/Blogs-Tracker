// SideBarCategory/SideBarCategory.tsx
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Folder, ChevronRight } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategories } from "../../api/useCategory";
import { useCategoryMutations } from "../../api/useMutation";
import { CategoryList } from "./CategoryList";

export const SideBarCategory = () => {
    const { user } = useStateContext();
    const userId = user?.id;

    const categoriesQuery = useCategories(userId);
    const { addCategory } = useCategoryMutations(userId);

    if (categoriesQuery.isLoading) return null;

    return (
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                    <Folder />
                    <span>Categories</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <CategoryList
                    categories={categoriesQuery.data ?? []}
                    onAdd={(name: any) => addCategory.mutate(name)}
                    isAdding={addCategory.isPending}
                />
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
