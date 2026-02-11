import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Loader2, Trash2 } from "lucide-react";
import { Tag } from "@/types/category";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategoryMutations } from "@/api/useMutation";

interface Props {
    tag: Tag;
}

export const TagItem = ({ tag }: Props) => {
    const { user } = useStateContext();
    const { deleteTagGlobalMutation } = useCategoryMutations(user?.id);

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton>
                <div className="flex w-full items-center justify-between gap-2">
                    <span className="">{tag.name}</span>
                    {deleteTagGlobalMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    ) : (
                        <Trash2
                            size={16}
                            className="cursor-pointer text-muted-foreground hover:text-red-500 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTagGlobalMutation.mutate(tag.id);
                            }}
                        />
                    )}
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
