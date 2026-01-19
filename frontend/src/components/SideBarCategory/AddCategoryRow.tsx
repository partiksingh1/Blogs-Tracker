// SideBarCategory/AddCategoryRow.tsx
import { useState } from "react";
import {
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarInput,
} from "@/components/ui/sidebar";
import { Plus, Check, X, LoaderCircle } from "lucide-react";

interface Props {
    onAdd: (name: string) => void;
    isLoading: boolean;
}

export const AddCategoryRow = ({ onAdd, isLoading }: Props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    if (!open) {
        return (
            <SidebarMenuSubItem>
                <SidebarMenuSubButton onClick={() => setOpen(true)} className="cursor-pointer">
                    <Plus className="cursor-pointer" />
                    <span>Add Category</span>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        );
    }

    return (
        <SidebarMenuSubItem>
            <div className="flex items-center gap-2 px-2">
                <SidebarInput
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onAdd(value);
                            setValue("");
                            setOpen(false);
                        }
                        if (e.key === "Escape") setOpen(false);
                    }}
                />
                {
                    isLoading ? (
                        <LoaderCircle />
                    ) : (
                        <button
                            disabled={!value || isLoading}
                            onClick={() => {
                                onAdd(value);
                                setValue("");
                                setOpen(false);
                            }}
                        >
                            <Check className="cursor-pointer" size={18} />
                        </button>
                    )
                }

                <button onClick={() => setOpen(false)}>
                    <X className="cursor-pointer" size={18} />
                </button>
            </div>
        </SidebarMenuSubItem >
    );
};
