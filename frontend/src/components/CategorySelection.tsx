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
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const CategorySelect = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setSelectedCategory] = useState("all");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const auth = getAuth(navigate);
      if (!auth) return;
      const { token, userId } = auth;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/category/${userId}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setCategories(res.data.categories || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    const auth = getAuth(navigate);
    if (!auth) return;
    const { token, userId } = auth;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/category`,
        { categoryName: newCategory.toLowerCase(), userId: userId },
        { headers: { Authorization: `${token}` } }
      );

      if (res.status === 201) {
        const created = res.data.category;
        setCategories([...categories, created]);
        setSelectedCategory(created.name);
        setNewCategory("");
        setShowAddCategoryModal(false);
        toast.success("Category created!");
      }
    } catch (err) {
      toast.error("Category already exists or failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Select onValueChange={(value) => setSelectedCategory(value)}>
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
            <Button onClick={handleCreateCategory} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
