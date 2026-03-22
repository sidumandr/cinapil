"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getImageUrl, type Movie } from "@/lib/tmdb";
import { useMovies } from "@/context/movie-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Check,
} from "lucide-react";

interface ResultCardProps {
  movie: Movie;
}

export function ResultCard({ movie }: ResultCardProps) {
  const { addToWatchlist, isInWatchlist, isInWatched } = useMovies();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showOverview, setShowOverview] = useState(false);
  const posterUrl = getImageUrl(movie.poster_path, "w200");
  const alreadyAdded = isInWatchlist(movie.id) || isInWatched(movie.id);

  return (
    <div className="card card-side bg-base-200/60 border border-base-300/50 shadow-lg hover:bg-base-200 hover:border-base-300 transition-all duration-300 overflow-hidden">
      {/* Poster */}
      <figure className="w-[140px] sm:w-[160px] flex-shrink-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            width={160}
            height={240}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="w-full h-full min-h-[200px] bg-gradient-to-b from-base-200 to-base-300 flex items-center justify-center">
            <span className="text-3xl opacity-20">🎬</span>
          </div>
        )}
      </figure>

      {/* Info */}
      <div className="card-body p-4 gap-2">
        {/* Title - clickable for overview */}
        <Link
          href={`/movie/${movie.id}`}
          className="card-title text-sm sm:text-base text-left hover:text-primary transition-colors cursor-pointer"
        >
          {movie.original_title || movie.title}
        </Link>

        {/* Overview toggle */}
        <button
          onClick={() => setShowOverview(!showOverview)}
          className="text-xs text-primary/60 hover:text-primary flex items-center gap-1"
        >
          {showOverview ? "Gizle" : "Özet"}
          {showOverview ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        {/* Overview - expandable */}
        {showOverview && movie.overview && (
          <p className="text-sm text-base-content/60 leading-relaxed animate-in">
            {movie.overview}
          </p>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          {movie.release_date && (
            <div className="badge badge-ghost badge-sm gap-1">
              <Calendar className="w-3 h-3" />
              {movie.release_date}
            </div>
          )}
          {movie.vote_average > 0 && (
            <div className="badge badge-warning badge-sm gap-1">
              <Star className="w-3 h-3 fill-current" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        {/* Action */}
        <div className="card-actions mt-auto pt-1">
          <button
            className={`btn btn-sm gap-2 ${
              alreadyAdded
                ? "btn-success btn-outline cursor-not-allowed opacity-60"
                : "btn-primary shadow-lg shadow-primary/20"
            }`}
            disabled={alreadyAdded}
            onClick={() => {
              if (!isAuthenticated) {
                router.push("/login");
                return;
              }
              addToWatchlist(movie);
            }}
          >
            {alreadyAdded ? (
              <>
                <Check className="w-4 h-4" />
                Listede Mevcut
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                İzleyeceklerime Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
