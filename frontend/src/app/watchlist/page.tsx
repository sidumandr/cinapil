"use client";

import { useMovies } from "@/context/movie-context";
import { MovieCard } from "@/components/movie-card";
import { List, Film, Plus } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";

export default function WatchlistPage() {
  return (
    <AuthGuard>
      <WatchlistContent />
    </AuthGuard>
  );
}

function WatchlistContent() {
  const { watchlist } = useMovies();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <List className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">İzleyeceklerim</h1>
          <div className="badge badge-primary badge-lg font-bold">
            {watchlist.length} Film
          </div>
        </div>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="watchlist" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
            <Film className="w-12 h-12 opacity-20" />
          </div>
          <h2 className="mt-6 text-xl font-semibold opacity-40">
            İzleyecekler listeniz boş
          </h2>
          <p className="mt-2 opacity-25">
            Film aramaya başlayarak listenizi doldurun
          </p>
        </div>
      )}
    </div>
  );
}
