import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { RootState } from "@/store/store";
import { createCategory, fetchCategories } from "@/store/thunks";
interface CategorySelectProps {
  id?: string;
  value?: string;
  onChange: (category: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState(value ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const dispatch = useAppDispatch();
  const { categories, isCategoryLoading } = useAppSelector((state: RootState) => state.blog);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedCategory(value);
    }
  }, [value]);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      const action = await dispatch(createCategory({ categoryName: newCategory.toLowerCase() }));
      if (createCategory.fulfilled.match(action)) {
        onChange(action.payload.name);
        setSelectedCategory(action.payload.name);
        setNewCategory("");
        setShowAddCategoryModal(false);
        toast.success("Category created!");
      } else {
        toast.error(action.payload as string || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Category already exists or failed to create");
    }
  };

  const sortedCategories = [...categories]
    .map(c => c.name?.trim())
    .filter(Boolean)
    .sort((a, b) => a!.localeCompare(b!)) as string[];

  return (
    <div className="flex flex-col gap-2">
      <Select
        onValueChange={(value) => {
          setSelectedCategory(value);
          onChange(value);
        }}
        value={selectedCategory}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose Category" />
        </SelectTrigger>
        <SelectContent>
          {sortedCategories.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}

          <div className="px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategoryModal(true)}
              className="w-full"
            >
              + Add Category
            </Button>
          </div>
        </SelectContent>
      </Select>

      <Dialog open={showAddCategoryModal} onOpenChange={(open) => {
        setShowAddCategoryModal(open);
        if (!open) setNewCategory("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new Category</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={isCategoryLoading}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateCategory}
              disabled={isCategoryLoading || !newCategory.trim()}
            >
              {isCategoryLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
