import { createContext, ReactNode, useContext, useMemo, useState } from "react";
interface SearchContextType {
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}
interface SearchProviderProps {
    children: ReactNode;
}
const SearchContext = createContext<SearchContextType>({
    search: "",
    setSearch: () => { }
})
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [search, setSearch] = useState("");
    const contextValue = useMemo(() => ({
        search,
        setSearch
    }), [search])
    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}
export const useSearchContext = () => useContext(SearchContext);