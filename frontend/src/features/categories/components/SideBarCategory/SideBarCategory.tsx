import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Folder, ChevronRight } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { CategoryList } from "./CategoryList";
import { useSearchContext } from "@/lib/SearchProvider";
import { useCategories } from "../../hooks/useCategories";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";

export const SideBarCategory = () => {
    const { user } = useStateContext();
    const userId = user?.id;
    const { setSelectedCategory } = useSearchContext();
    const categoriesQuery = useCategories(userId);
    const { addCategory } = useCategoryMutations(userId as string);

    return (
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                    <Folder />
                    <span onClick={(e) => {
                        e.stopPropagation(); // Prevent collapsing when clicking the label
                        setSelectedCategory("");
                    }}>Categories</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
                {categoriesQuery.isLoading ? (
                    <>
                        <SidebarMenuSkeleton />
                    </>
                ) : (
                    <CategoryList
                        categories={categoriesQuery.data ?? []}
                        onAdd={(name: string) => addCategory.mutate({ name })}
                        isAdding={addCategory.isPending}
                    />
                )}
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
