import { useState } from "react";
import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarInput,
} from "@/components/ui/sidebar";
import { MoreHorizontalIcon, Edit, X, Trash2, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/category";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategoryMutations } from "../../api/useMutation";
import { useSearchContext } from "@/lib/SearchProvider";

interface Props {
    category: Category;
    isEditing: Boolean;
    onStartEdit: () => void
    onCancelEdit: () => void
    onDelete: () => void
}

export const CategoryItem = ({ category, isEditing, onStartEdit, onCancelEdit, onDelete }: Props) => {
    const [value, setValue] = useState(category.name);
    const { user } = useStateContext();
    const { selectedCategory, setSelectedCategory } = useSearchContext();
    const userId = user?.id;
    const { updateMutation } = useCategoryMutations(userId);
    const handleUpdate = () => {
        updateMutation.mutate({ categoryId: category.id, categoryName: value });
    }
    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                onClick={() => {
                    if (selectedCategory === category.id) {
                        setSelectedCategory(""); // deselect if clicked again
                    } else {
                        setSelectedCategory(category.id); // select if not already
                    }
                }}
                className={`cursor-pointer ${selectedCategory === category.id
                    ? "bg-gray-400"      // selected
                    : "" // not selected
                    }`}

            >                <div className="flex w-full items-center justify-between gap-2">
                    {isEditing ? (
                        <SidebarInput
                            className="shadow-amber-400"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") onCancelEdit();
                            }}
                        />
                    ) : (
                        <span className="truncate">{category.name}</span>
                    )}

                    {!isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded hover:bg-muted cursor-pointer">
                                    <MoreHorizontalIcon size={16} />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem className="cursor-pointer" onClick={onStartEdit}>
                                    <Edit /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="bg-red-50 cursor-pointer" onClick={onDelete}>
                                    <Trash2 color="red" />
                                    <span className="text-red-600">Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {isEditing && (
                        <button className="flex justify-center items-center gap-2" onClick={onCancelEdit}>
                            <X className="cursor-pointer" size={16} />
                            <Check onClick={handleUpdate} className="cursor-pointer" size={16} />
                        </button>

                    )}
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
