import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";
import { useStateContext } from "@/lib/ContextProvider";
import { useCategories } from "@/features/categories/hooks/useCategories";

interface CategorySelectProps {
  id?: string;
  value?: string;
  onChange: (category: string) => void;
}
export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { user } = useStateContext();
  const userId = user?.id;

  const categoriesQuery = useCategories(userId);

  const categories: Category[] = categoriesQuery.data ?? [];

  const sortedCategories = categories
    .map((category) => category.name?.trim())
    .filter(Boolean)
    .sort();

  return (
    <div className="flex flex-col gap-2">
      <Select
        onValueChange={(val) => onChange(val)}
        value={value ?? ""}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Choose Category" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="null">No Category</SelectItem>

          {categoriesQuery.isLoading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : sortedCategories.length > 0 ? (
            sortedCategories.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="empty" disabled>
              No categories available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

