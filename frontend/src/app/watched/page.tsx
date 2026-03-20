"use client";

import { useMovies } from "@/context/movie-context";
import { MovieCard } from "@/components/movie-card";
import { Eye, Film, Plus } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";

export default function WatchedPage() {
  return (
    <AuthGuard>
      <WatchedContent />
    </AuthGuard>
  );
}

function WatchedContent() {
  const { watched } = useMovies();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-success" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">İzlediklerim</h1>
          <div className="badge badge-success badge-lg font-bold">
            {watched.length} Film
          </div>
        </div>
      </div>

      {watched.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watched.map((movie) => (
            <MovieCard key={movie.id} movie={movie} type="watched" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center">
            <Film className="w-12 h-12 opacity-20" />
          </div>
          <h2 className="mt-6 text-xl font-semibold opacity-40">
            Henüz izlediğiniz bir film yok
          </h2>
          <p className="mt-2 opacity-25">
            İzleyecekler listenizden filmleri izlediğinizde buraya ekleyin
          </p>
        </div>
      )}
    </div>
  );
}
