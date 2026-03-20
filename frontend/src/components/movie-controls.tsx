"use client";

import { useMovies } from "@/context/movie-context";
import type { Movie } from "@/lib/tmdb";
import { Eye, EyeOff, Trash2, Info } from "lucide-react";
import Link from "next/link";

interface MovieControlsProps {
  movie: Movie;
  type: "watchlist" | "watched";
}

export function MovieControls({ movie, type }: MovieControlsProps) {
  const {
    removeFromWatchlist,
    moveToWatched,
    moveToWatchlist,
    removeFromWatched,
    isInWatched,
  } = useMovies();

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-2.5">
      <Link
        href={`/movie/${movie.id}`}
        onClick={(e) => e.stopPropagation()}
        className="btn btn-circle btn-sm btn-primary btn-outline border-primary/30 hover:border-primary"
        title="Film Detayları"
      >
        <Info className="w-4 h-4" />
      </Link>

      {type === "watchlist" && (
        <>
          <button
            className="btn btn-circle btn-sm btn-success btn-outline border-success/30 hover:border-success"
            onClick={(e) => {
              if (isInWatched(movie.id)) return;
              handleAction(e, () => moveToWatched(movie.id));
            }}
            title="İzledim olarak işaretle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn btn-circle btn-sm btn-error btn-outline border-error/30 hover:border-error"
            onClick={(e) =>
              handleAction(e, () => removeFromWatchlist(movie.id))
            }
            title="Listeden kaldır"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}

      {type === "watched" && (
        <>
          <button
            className="btn btn-circle btn-sm btn-info btn-outline border-info/30 hover:border-info"
            onClick={(e) => handleAction(e, () => moveToWatchlist(movie.id))}
            title="İzleyeceklerime taşı"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            className="btn btn-circle btn-sm btn-error btn-outline border-error/30 hover:border-error"
            onClick={(e) => handleAction(e, () => removeFromWatched(movie.id))}
            title="Listeden kaldır"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}
