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
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Category } from "@/types/category";

interface CategorySelectProps {
  id?: string;
  value?: string;
  onChange: (category: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const [selectedCategory, setSelectedCategory] = useState(value ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // useEffect to fetch categories when token is available
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]); // Adding token to dependencies ensures it refetches if token changes

  // Fetch categories from the server
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      setIsCategoryLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/categories/${userId}`, {
        headers: { Authorization: `${token}` },
      });
      console.log("res is", res);


      // Ensure `data` is always an array before setting it to state
      if (Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else {
        setCategories([]); // Fallback to empty array if not an array
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error("Failed to fetch categories");
      setCategories([]); // Ensure categories are reset to an empty array on error
    } finally {
      setIsCategoryLoading(false);
    }
  }, [token, userId]);

  // Create a new category
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setIsCategoryLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/categories`,
        { name: newCategory.trim(), userId: userId },
        { headers: { Authorization: `${token}` } }
      );
      setNewCategory("");
      setShowAddCategoryModal(false);
      fetchCategories(); // Refresh categories after adding
      toast.success("Category created!");
    } catch (err) {
      console.error("Failed to create category", err);
      toast.error("Failed to create category");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  // Sorted and trimmed category names for better display
  const sortedCategories = categories
    .map((category) => category.name?.trim())
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
          {sortedCategories.length > 0 ? (
            sortedCategories.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-categories" disabled>
              No categories available
            </SelectItem>
          )}

          {/* Add Category Button */}
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

      {/* Add Category Modal */}
      <Dialog
        open={showAddCategoryModal}
        onOpenChange={(open) => {
          setShowAddCategoryModal(open);
          if (!open) setNewCategory(""); // Clear input when modal is closed
        }}
      >
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
