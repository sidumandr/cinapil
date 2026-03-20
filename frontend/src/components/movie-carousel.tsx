"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getPopularMovies, getImageUrl, type Movie } from "@/lib/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MovieCarousel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getPopularMovies()
      .then((data) => setMovies(data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-slide
  useEffect(() => {
    if (movies.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [movies.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);
  };

  const prev = () => goTo((current - 1 + movies.length) % movies.length);
  const next = () => goTo((current + 1) % movies.length);

  if (loading) {
    return (
      <div className="w-full h-[350px] sm:h-[450px] bg-base-200 animate-pulse" />
    );
  }

  if (movies.length === 0) return null;

  const movie = movies[current];
  const backdropUrl = getImageUrl(movie.backdrop_path, "original");

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] overflow-hidden group">
      {/* Background Image */}
      {backdropUrl ? (
        <Image
          key={movie.id}
          src={backdropUrl}
          alt={movie.title}
          fill
          sizes="100vw"
          className="object-cover transition-all duration-700"
          priority
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-base-200 to-base-300" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-base-100/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="max-w-3xl">
          <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold drop-shadow-lg">
            {movie.title}
          </h3>
          <p className="mt-3 text-sm sm:text-base text-base-content/70 line-clamp-2 max-w-2xl">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="btn btn-circle btn-sm bg-black/40 border-white/10 text-white hover:bg-black/60 absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="btn btn-circle btn-sm bg-black/40 border-white/10 text-white hover:bg-black/60 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary w-6"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
