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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
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

export const CategoryItem = ({
    category,
    isEditing,
    onStartEdit,
    onCancelEdit,
}: Props) => {
    const [value, setValue] = useState(category.name);
    const { user } = useAuthContext();
    const { selectedCategory, setSelectedCategory } = useSearchContext();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const userId = user?.id as string;
    const { updateCategoryMutation, removeCategory } = useCategoryMutations(userId);

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

    const handleDelete = () => {
        removeCategory.mutate(category.id, {
            onSuccess: () => {
                if (selectedCategory === category.id) setSelectedCategory("");
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                onClick={() =>
                    setSelectedCategory(selectedCategory === category.id ? "" : category.id)
                }
                className={`cursor-pointer ${selectedCategory === category.id ? "bg-gray-200 dark:bg-gray-700" : ""
                    }`}
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
                            className="flex-1 px-2 py-1 text-sm"
                        />
                    ) : (
                        <span className="truncate text-sm">{category.name}</span>
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

                                <DropdownMenuContent className="w-40">
                                    <DropdownMenuItem onClick={onStartEdit}>
                                        <Edit size={16} className="mr-2" /> Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="flex items-center gap-2 text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                className="p-1 rounded hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelEdit();
                                }}
                            >
                                <X size={16} />
                            </button>

                            <button
                                className="p-1 rounded hover:bg-muted cursor-pointer"
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

            {/* Alert Dialog for Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the category "{category.name}"? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="space-x-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            {removeCategory.isPending ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarMenuSubItem>
    );
};
