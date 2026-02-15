import { useState } from "react";
import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarInput,
} from "@/components/ui/sidebar";
import { MoreHorizontalIcon, Edit, X, Trash2, Check, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/category";
import { useAuthContext } from "@/context/AuthContext";
import { useSearchContext } from "@/context/SearchContext";
import { useCategoryMutations } from "../../hooks/useCategoryMutations";

interface Props {
    category: Category;
    isEditing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;
}

export const CategoryItem = ({ category, isEditing, onStartEdit, onCancelEdit }: Props) => {
    const [value, setValue] = useState(category.name);
    const { user } = useAuthContext();
    const { selectedCategory, setSelectedCategory } = useSearchContext();
    const userId = user?.id as string;

    const { updateCategoryMutation, removeCategory } = useCategoryMutations(userId);

    // Handle category update
    const handleUpdate = () => {
        if (!value.trim() || value === category.name) {
            onCancelEdit();
            return;
        }
        updateCategoryMutation.mutate(
            { categoryId: category.id, name: value },
            { onSuccess: () => onCancelEdit() }
        );
    };

    // Handle category deletion
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this category?")) {
            removeCategory.mutate(category.id);
            if (selectedCategory === category.id) setSelectedCategory(""); // deselect if deleting selected
        }
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? "" : category.id)
                }
                className={`cursor-pointer ${selectedCategory === category.id ? "bg-gray-400" : ""}`}
            >
                <div className="flex w-full items-center justify-between gap-2">
                    {/* Category Name / Editing Input */}
                    {isEditing ? (
                        <SidebarInput
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") onCancelEdit();
                                if (e.key === "Enter") handleUpdate();
                            }}
                            autoFocus
                        />
                    ) : (
                        <span className="truncate">{category.name}</span>
                    )}

                    {/* Actions */}
                    {!isEditing ? (
                        removeCategory.isPending ? (
                            <Loader2 className="animate-spin text-muted-foreground" size={16} />
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="p-1 rounded hover:bg-muted cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontalIcon size={16} />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={onStartEdit}>
                                        <Edit size={16} className="mr-2" /> Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete();
                                        }}
                                        className="flex items-center gap-2 text-red-600"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelEdit();
                                }}
                            >
                                <X size={16} />
                            </button>

                            <button
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate();
                                }}
                                disabled={updateCategoryMutation.isPending}
                            >
                                {updateCategoryMutation.isPending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Check size={16} />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
