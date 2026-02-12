import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
interface SearchContextType {
    search: string,
    debouncedSearch: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    selectedCategory: string,
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    tag: string,
    setTag: React.Dispatch<React.SetStateAction<string>>;
}
interface SearchProviderProps {
    children: ReactNode;
}
const SearchContext = createContext<SearchContextType>({
    search: "",
    debouncedSearch: "",
    setSearch: () => { },
    selectedCategory: "",
    setSelectedCategory: () => { },
    tag: "",
    setTag: () => { }
})
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [tag, setTag] = useState("");

    // Debounce search input to avoid excessive re-renders/filtering
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handler);
    }, [search]);

    const contextValue = useMemo(() => ({
        search,
        debouncedSearch,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        tag,
        setTag
    }), [search, debouncedSearch, selectedCategory, tag])
    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}
export const useSearchContext = () => useContext(SearchContext);