"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { searchMovies, type Movie } from "@/lib/tmdb";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: Movie[];
  loading: boolean;
  error: string | null;
  isSearching: boolean;
  clearSearch: () => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const isSearching = query.trim().length > 0;

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (q.trim() === "") {
      setResults([]);
      setError(null);
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim() === "") return;

    const timeoutId = setTimeout(() => {
      setLoading(true);
      setError(null);
      searchMovies(query)
        .then((data) => {
          setResults(data);
          setLoading(false);
          // Auto-scroll to results
          setTimeout(() => {
            resultsRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, [setQuery]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        results,
        loading,
        error,
        isSearching,
        clearSearch,
        resultsRef,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
