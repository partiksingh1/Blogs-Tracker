// SideBarCategory/CategoryList.tsx
import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Category } from "@/types/category";
import { CategoryItem } from "./CategoryItem";
import { AddCategoryRow } from "./AddCategoryRow";
import { useState } from "react";
import { useCategoryMutations } from "../../api/useMutation";
import { useStateContext } from "@/lib/ContextProvider";

interface Props {
    categories: Category[];
    onAdd: (name: string) => void;
    isAdding: boolean;
}

export const CategoryList = ({ categories, onAdd, isAdding }: Props) => {
    const { user } = useStateContext();
    const userId = user?.id;
    const [editingCategoryId, setEditingCategoryId] = useState<String | null>(null);
    const { deleteCategory } = useCategoryMutations(userId)
    const handleDelete = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        deleteCategory(categoryId)
    }
    return (
        <SidebarMenuSub>
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    isEditing={editingCategoryId === category.id}
                    onStartEdit={() => setEditingCategoryId(category.id)}
                    onCancelEdit={() => setEditingCategoryId(null)}
                    onDelete={() => handleDelete(category.id)}
                />
            ))}

            <AddCategoryRow onAdd={onAdd} isLoading={isAdding} />
        </SidebarMenuSub>
    );
};
