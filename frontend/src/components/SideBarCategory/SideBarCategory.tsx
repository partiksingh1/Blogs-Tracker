import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Folder, ChevronRight } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategoryMutations } from "../../api/useMutation";
import { CategoryList } from "./CategoryList";
import { useCategories } from "@/api/useQueries";
import { useSearchContext } from "@/lib/SearchProvider";

export const SideBarCategory = () => {
    const { user, token } = useStateContext();
    const userId = user?.id;
    const { setSelectedCategory } = useSearchContext();
    const categoriesQuery = useCategories(userId, token as string);
    const { addCategory } = useCategoryMutations(userId);

    if (categoriesQuery.isLoading) return null;

    return (
        <SidebarMenuItem>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                    <Folder />
                    <span onClick={() => { setSelectedCategory("") }} >Categories</span>
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
                        onAdd={(name: any) => addCategory.mutate(name)}
                        isAdding={addCategory.isPending}
                    />
                )}
            </CollapsibleContent>
        </SidebarMenuItem>
    );
};
