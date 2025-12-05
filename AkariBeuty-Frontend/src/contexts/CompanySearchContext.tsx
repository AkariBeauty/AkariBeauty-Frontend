import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface CompanySearchContextValue {
    query: string;
    setQuery: (value: string) => void;
    clear: () => void;
}

const CompanySearchContext = createContext<CompanySearchContextValue | undefined>(undefined);

export function CompanySearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState("");

    const clear = useCallback(() => setQuery(""), []);

    const value = useMemo(
        () => ({
            query,
            setQuery,
            clear,
        }),
        [query, clear]
    );

    return <CompanySearchContext.Provider value={value}>{children}</CompanySearchContext.Provider>;
}

export function useCompanySearch() {
    const context = useContext(CompanySearchContext);
    if (!context) throw new Error("useCompanySearch must be used within CompanySearchProvider");
    return context;
}
