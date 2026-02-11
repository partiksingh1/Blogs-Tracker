import { createContext, ReactNode, useContext, useMemo, useState } from "react";
interface SearchContextType {
    search: string,
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
    setSearch: () => { },
    selectedCategory: "",
    setSelectedCategory: () => { },
    tag: "",
    setTag: () => { }
})
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [tag, setTag] = useState("");
    const contextValue = useMemo(() => ({
        search,
        setSearch,
        selectedCategory,
        setSelectedCategory,
        tag,
        setTag
    }), [search, selectedCategory, tag])
    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}
export const useSearchContext = () => useContext(SearchContext);