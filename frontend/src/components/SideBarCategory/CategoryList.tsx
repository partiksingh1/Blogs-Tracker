import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Category } from "@/types/category";
import { CategoryItem } from "./CategoryItem";
import { AddCategoryRow } from "./AddCategoryRow";
import { useState } from "react";

interface Props {
    categories: Category[];
    onAdd: (name: string) => void;
    isAdding: boolean;
}

export const CategoryList = ({ categories, onAdd, isAdding }: Props) => {
    const [editingCategoryId, setEditingCategoryId] = useState<String | null>(null);
    return (
        <SidebarMenuSub>
            {categories.map((category) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    isEditing={editingCategoryId === category.id}
                    onStartEdit={() => setEditingCategoryId(category.id)}
                    onCancelEdit={() => setEditingCategoryId(null)}
                />
            ))}

            <AddCategoryRow onAdd={onAdd} isLoading={isAdding} />
        </SidebarMenuSub>
    );
};
