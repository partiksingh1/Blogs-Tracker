import { useEffect, useState } from "react";
import { Button } from "./ui/button"; // Assuming you have a Button component
import { Card } from "./ui/card"; // Assuming you have a Card component
import { Category } from "@/types/category";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

interface ManageCategoriesProps {
    onClose: () => void;
}

export const ManageCategories = ({ onClose }: ManageCategoriesProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState(""); // State for new category name
    const [isCategoryLoading, setIsCategoryLoading] = useState(false); // Loading state for category creation
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    // Fetch categories from the API
    const fetchCategories = async () => {
        if (!token) {
            console.error("Please login to continue");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/categories/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCategories(result.data); // Adjust based on your API response structure
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle category deletion
    const handleDeleteCategory = async (categoryId: string) => {
        if (!token) {
            console.error("Please login to continue");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/categories/${categoryId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Remove the deleted category from the state
            setCategories((prevCategories) =>
                prevCategories.filter((cat) => cat.id !== categoryId)
            );
            toast.success("Category deleted successfully");
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    // Handle category creation
    const handleCreateCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            setIsCategoryLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/categories`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newCategory.trim(),
                        userId: userId,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create category");
            }

            const result = await response.json();
            setCategories((prevCategories) => [
                ...prevCategories,
                { id: result.data.id, name: newCategory.trim() }, // Assuming API response returns the new category
            ]);
            setNewCategory(""); // Clear input
            toast.success("Category created!");
        } catch (err) {
            console.error("Failed to create category", err);
            toast.error("Failed to create category");
        } finally {
            setIsCategoryLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return <div>Loading categories...</div>; // You can replace this with a skeleton or loading spinner
    }

    return (
        <div className="relative p-4">
            {/* Close button in the top-right corner */}
            <button
                onClick={onClose}
                className="absolute top-0 right-0 text-2xl text-gray-500 hover:text-gray-700 p-3"
            >
                &times; {/* This is the "×" symbol for a cross */}
            </button>

            <h2 className="text-lg font-semibold mb-4">Manage Categories</h2>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                categories.map((category) => (
                    <Card key={category.id} className="flex justify-between items-center p-2 mb-2">
                        <span>{category.name}</span>
                        <Button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-500 text-white"
                        >
                            Delete
                        </Button>
                    </Card>
                ))
            )}

            {/* Add New Category Section */}
            <div className="flex gap-2 mt-4">
                <Input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input-field"
                />
                <Button
                    onClick={handleCreateCategory}
                    disabled={isCategoryLoading}
                >
                    {isCategoryLoading ? "Creating..." : "Add Category"}
                </Button>
            </div>
        </div>
    );
};
