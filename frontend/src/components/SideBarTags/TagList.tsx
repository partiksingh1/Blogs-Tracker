// SideBarCategory/CategoryList.tsx
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Category, Tag } from "@/types/category";
// import { CategoryItem, TagItem } from "./TagItem";
// import { AddCategoryRow } from "./AddCategoryRow";
import { useState } from "react";
import { useStateContext } from "@/lib/ContextProvider";
import { TagItem } from "./TagItem";

interface Props {
    tags: Tag[];
    // onAdd: (name: string) => void;
    // isAdding: boolean;
}

export const TagList = ({ tags }: Props) => {
    const { user } = useStateContext();
    const userId = user?.id;
    const [editingCategoryId, setEditingCategoryId] = useState<String | null>(null);
    // const { deleteCategory } = useCategoryMutations(userId)
    // const handleDelete = async (categoryId: string) => {
    //     if (!confirm("Are you sure you want to delete this category?")) return;
    //     deleteCategory(categoryId)
    // }
    console.log("tags are ", tags)
    return (
        <SidebarMenuSub>
            {tags.map((tag) => (
                <TagItem
                    tag={tag}
                // onDelete={() => handleDelete(category.id)}
                />
            ))}
            {/* 
            <AddCategoryRow onAdd={onAdd} isLoading={isAdding} /> */}
        </SidebarMenuSub>
    );
};
