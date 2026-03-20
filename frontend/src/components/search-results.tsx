"use client";

import { useSearch } from "@/context/search-context";
import { ResultCard } from "@/components/result-card";
import { Search, X } from "lucide-react";

export function SearchResults() {
  const { query, results, loading, error, isSearching, clearSearch, resultsRef } =
    useSearch();

  if (!isSearching) return null;

  return (
    <div ref={resultsRef} className="border-t border-base-300 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            &quot;{query}&quot; için sonuçlar
            {!loading && results.length > 0 && (
              <span className="badge badge-sm badge-primary">{results.length}</span>
            )}
          </h2>
          <button onClick={clearSearch} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card card-side bg-base-200/60 animate-pulse">
                <figure className="w-[140px] h-[210px] bg-base-300" />
                <div className="card-body gap-3">
                  <div className="h-5 bg-base-300 rounded w-3/4" />
                  <div className="h-4 bg-base-300 rounded w-1/2" />
                  <div className="h-4 bg-base-300 rounded w-1/3" />
                  <div className="h-8 bg-base-300 rounded w-40 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>Hata: {error}</span>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((movie) => (
              <ResultCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && !error && (
          <div className="py-12 text-center">
            <p className="text-lg opacity-40">Sonuç bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
