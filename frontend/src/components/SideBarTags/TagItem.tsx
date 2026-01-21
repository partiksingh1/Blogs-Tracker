// SideBarCategory/CategoryItem.tsx
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
import { Category, Tag } from "@/types/category";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useStateContext } from "@/lib/ContextProvider";

interface Props {
    tag: Tag;
    // isEditing: Boolean;
    // onStartEdit: () => void
    // onCancelEdit: () => void

}

export const TagItem = ({ tag }: Props) => {
    const [value, setValue] = useState(tag.name);
    const { user } = useStateContext();
    const userId = user?.id;
    // const { updateMutation } = useCategoryMutations(userId);
    // const handleUpdate = () => {
    //     updateMutation.mutate({ categoryId: category.id, categoryName: value });
    // }
    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton>
                <div className="flex w-full items-center justify-between gap-2">
                    <span className="">{tag.name}</span>

                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
