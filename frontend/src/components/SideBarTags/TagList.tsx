import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Tag } from "@/types/category";

interface Props {
    tags: Tag[];
}

export const TagList = ({ tags }: Props) => {
    return (
        <SidebarMenuSub>
            {tags?.map((tag) => (
                <SidebarMenuSubItem key={tag.id}>
                    <SidebarMenuSubButton>
                        <div className="flex w-full items-center justify-between gap-2">
                            <span className="">{tag.name}</span>
                        </div>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            ))}
        </SidebarMenuSub>
    );
};
