import { SidebarMenuSub } from "@/components/ui/sidebar";
import { Tag } from "@/types/category";
import { TagItem } from "./TagItem";

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
