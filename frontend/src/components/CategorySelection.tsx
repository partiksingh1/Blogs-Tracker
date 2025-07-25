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
  onChange: (category: string) => void; // New prop for handling category change
}
export const CategorySelect = ({ onChange }: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const dispatch = useAppDispatch();
  const { categories, isCategoryLoading } = useAppSelector((state: RootState) => state.blog);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      await dispatch(fetchCategories());
    };
    fetchCategoriesData();
  }, [dispatch]);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      const action = await dispatch(createCategory({ categoryName: newCategory.toLowerCase() }));
      if (createCategory.fulfilled.match(action)) {
        setSelectedCategory(action.payload.name);
        setNewCategory("");
        setShowAddCategoryModal(false);
        toast.success("Category created!");
      } else {
        toast.error(action.payload as string || "Failed to create category");
      }
    } catch (err) {
      toast.error("Category already exists or failed to create");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Select onValueChange={(value) => {
        setSelectedCategory(value)
        onChange(value)
      }} value={selectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => {
            const name = cat.name?.trim();
            if (!name) return null; // Don't render empty ones
            return (
              <SelectItem key={cat.id} value={name}>
                {name}
              </SelectItem>
            );
          })}


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

      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new Category</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCategory} disabled={isCategoryLoading}>
              {isCategoryLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
