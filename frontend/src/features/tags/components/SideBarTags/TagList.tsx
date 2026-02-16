import { SidebarMenuSub } from "@/components/ui/sidebar";
import { TagItem } from "./TagItem";
import { Tag } from "@/types/tag";

interface Props {
    tags: Tag[];
}

export const TagList = ({ tags }: Props) => {
    return (
        <SidebarMenuSub>
            {tags?.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
            ))}
        </SidebarMenuSub>
    );
};
