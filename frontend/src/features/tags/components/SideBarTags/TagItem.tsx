import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Loader2, Trash2 } from "lucide-react";
import { useStateContext } from "@/lib/ContextProvider";
import { Tag } from "@/types/tag";
import { useTagMutations } from "../../hooks/useTagMutations";

interface Props {
    tag: Tag;
}

export const TagItem = ({ tag }: Props) => {
    const { user } = useStateContext();
    const { deleteTag } = useTagMutations(user?.id as string);

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton>
                <div className="flex w-full items-center justify-between gap-2">
                    <span className="">{tag.name}</span>
                    {deleteTag.isPending ? (
                        <Loader2 size={16} className="animate-spin text-muted-foreground" />
                    ) : (
                        <Trash2
                            size={16}
                            className="cursor-pointer text-muted-foreground hover:text-red-500 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTag.mutate(tag.id);
                            }}
                        />
                    )}
                </div>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    );
};
