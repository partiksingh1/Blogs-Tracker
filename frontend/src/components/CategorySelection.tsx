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
import { useState } from "react";
import { Category } from "@/types/category";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategories } from "@/api/useQueries";

interface CategorySelectProps {
  id?: string;
  value?: string;
  onChange: (category: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState(value ?? "");
  const [, setNewCategory] = useState("");
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
        <SelectTrigger className="w-45">
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
      </Dialog>
    </div>
  );
};
