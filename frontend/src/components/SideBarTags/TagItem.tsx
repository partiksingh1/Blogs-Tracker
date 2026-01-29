import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Tag } from "@/types/category";

interface Props {
    tag: Tag;
}

export const TagItem = ({ tag }: Props) => {
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
