import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
} from "@/components/ui/dialog";
import { useEffect, useState, useCallback } from "react";
import { Category } from "@/types/category";
import { useCategories } from "@/api/useCategory";
import { useStateContext } from "@/lib/ContextProvider";

interface CategorySelectProps {
  id?: string;
  value?: string;
  onChange: (category: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState(value ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const { user } = useStateContext();
  const userId = user?.id;
  const categoriesQuery = useCategories(userId);

  // Sorted and trimmed category names for better display
  const sortedCategories = categoriesQuery.data
    .map((category: Category) => category.name?.trim())
    .filter(Boolean) // Remove falsy values such as empty strings
    .sort();

  return (
    <div className="flex flex-col gap-2">
      {/* Category Selector */}
      <Select
        onValueChange={(value) => {
          setSelectedCategory(value);
          onChange(value); // Pass the selected category value to the parent
        }}
        value={selectedCategory}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose Category" />
        </SelectTrigger>
        <SelectContent>
          {/* Check if there are categories and render accordingly */}
          <SelectItem value="null">
            No Category
          </SelectItem>
          {sortedCategories.length > 0 ? (
            sortedCategories.map((name: string) => (
              <>
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              </>
            ))
          ) : (
            <SelectItem value="no-categories" disabled>
              No categories available
            </SelectItem>
          )}
          {/* 
          Add Category Button
          <div className="px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddCategoryModal(true)}
              className="w-full"
            >
              + Add Category
            </Button>
          </div> */}
        </SelectContent>
      </Select>

      {/* Add Category Modal */}
      <Dialog
        open={showAddCategoryModal}
        onOpenChange={(open) => {
          setShowAddCategoryModal(open);
          if (!open) setNewCategory(""); // Clear input when modal is closed
        }}
      >
        {/* <DialogContent>
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
              // onClick={handleCreateCategory}
              disabled={isCategoryLoading || !newCategory.trim()}
            >
              {isCategoryLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent> */}
      </Dialog>
    </div>
  );
};
