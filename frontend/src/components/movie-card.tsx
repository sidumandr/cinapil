"use client";

import Image from "next/image";
import { getImageUrl, type Movie } from "@/lib/tmdb";
import { MovieControls } from "./movie-controls";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  type: "watchlist" | "watched";
}

export function MovieCard({ movie, type }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w300");

  return (
    <div className="group relative card bg-base-200 shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/5">
      <figure className="relative aspect-[2/3]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-base-200 to-base-300 flex items-center justify-center">
            <span className="text-4xl opacity-20">🎬</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {movie.vote_average > 0 && (
          <div className="badge badge-sm badge-warning gap-1 absolute top-2 right-2 font-bold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <MovieControls movie={movie} type={type} />
        </div>
      </figure>

      <div className="card-body p-3 gap-0.5">
        <h3 className="card-title text-sm font-semibold truncate">
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className="text-xs text-base-content/40">
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
      </div>
    </div>
  );
}
