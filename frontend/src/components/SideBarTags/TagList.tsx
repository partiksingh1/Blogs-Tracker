import { useCategoryMutations } from "@/api/useMutation";
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useStateContext } from "@/lib/ContextProvider";
import { Tag } from "@/types/category";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
    tags: Tag[];
}

export const TagList = ({ tags }: Props) => {
    const { user } = useStateContext();
    const { deleteTagGlobalMutation } = useCategoryMutations(user?.id);
    return (
        <SidebarMenuSub>
            {tags?.map((tag) => {
                const isDeleting =
                    deleteTagGlobalMutation.isPending &&
                    deleteTagGlobalMutation.variables === tag.id;

                return (
                    <SidebarMenuSubItem key={tag.id}>
                        <SidebarMenuSubButton>
                            <div className="flex w-full items-center justify-between gap-2">
                                <span>{tag.name}</span>

                                {isDeleting ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin text-gray-500"
                                    />
                                ) : (
                                    <Trash2
                                        size={16}
                                        className="cursor-pointer text-red-500"
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
            })}
        </SidebarMenuSub>
    );
};
