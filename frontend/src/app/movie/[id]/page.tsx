"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getMovieDetails,
  getMovieCredits,
  getImageUrl,
  type MovieDetail,
  type MovieCredits,
} from "@/lib/tmdb";
import { useMovies } from "@/context/movie-context";
import { useAuth } from "@/context/auth-context";
import {
  Star,
  Clock,
  Calendar,
  ArrowLeft,
  Plus,
  Eye,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = Number(params.id);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToWatchlist, addToWatched, isInWatchlist, isInWatched } =
    useMovies();

  useEffect(() => {
    if (!movieId) return;
    Promise.all([getMovieDetails(movieId), getMovieCredits(movieId)])
      .then(([m, c]) => {
        setMovie(m);
        setCredits(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg opacity-40">Film bulunamadı</p>
      </div>
    );
  }

  const backdrop = getImageUrl(movie.backdrop_path, "original");
  const poster = getImageUrl(movie.poster_path, "w500");
  const director = credits?.crew.find((c) => c.job === "Director");
  const cast = credits?.cast.slice(0, 10) || [];
  const inWatchlist = isInWatchlist(movie.id);
  const inWatched = isInWatched(movie.id);

  return (
    <div>
      {/* Backdrop Hero */}
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        {backdrop ? (
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-base-200 to-base-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base-100/80 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <button
              className="btn btn-sm btn-ghost bg-black/30 text-white border-white/10 hover:bg-black/50 gap-1.5"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            {poster ? (
              <Image
                src={poster}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-xl shadow-2xl border border-base-300"
              />
            ) : (
              <div className="w-[300px] h-[450px] bg-base-200 rounded-xl flex items-center justify-center">
                <Star className="w-12 h-12 opacity-20" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-16">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {movie.title}
            </h1>
            {movie.original_title !== movie.title && (
              <p className="text-base-content/40 text-lg mt-1">
                {movie.original_title}
              </p>
            )}

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-base-content/50 italic mt-2">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="badge badge-lg badge-warning gap-1 font-bold">
                <Star className="w-3.5 h-3.5" />
                {movie.vote_average.toFixed(1)}
              </div>
              {movie.release_date && (
                <div className="badge badge-lg badge-outline gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {movie.release_date.split("-")[0]}
                </div>
              )}
              {movie.runtime && (
                <div className="badge badge-lg badge-outline gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(movie.runtime / 60)}s {movie.runtime % 60}dk
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movie.genres.map((g) => (
                  <div key={g.id} className="badge badge-primary badge-outline">
                    {g.name}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {isAuthenticated && (
              <div className="flex flex-wrap gap-2 mt-6">
                {inWatchlist ? (
                  <button className="btn btn-success btn-sm gap-1.5" disabled>
                    <Check className="w-4 h-4" />
                    İzleyeceklerimde
                  </button>
                ) : inWatched ? (
                  <button className="btn btn-success btn-sm gap-1.5" disabled>
                    <Check className="w-4 h-4" />
                    İzlediklerimde
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => addToWatchlist(movie)}
                      className="btn btn-primary btn-sm gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      İzleyeceklerime Ekle
                    </button>
                    <button
                      onClick={() => addToWatched(movie)}
                      className="btn btn-outline btn-sm gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      İzlediklerime Ekle
                    </button>
                  </>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-6">
                <Link href="/login">
                  <button className="btn btn-primary btn-sm gap-1.5">
                    Listene eklemek için giriş yap
                  </button>
                </Link>
              </div>
            )}

            {/* Overview */}
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Özet</h2>
              <p className="text-base-content/70 leading-relaxed">
                {movie.overview || "Özet bulunamadı."}
              </p>
            </div>

            {/* Director */}
            {director && (
              <div className="mt-4">
                <span className="font-bold">Yönetmen: </span>
                <span className="text-base-content/70">{director.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Oyuncular</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {cast.map((person) => (
                <div
                  key={person.id}
                  className="flex-shrink-0 w-[120px] text-center"
                >
                  {person.profile_path ? (
                    <Image
                      src={getImageUrl(person.profile_path, "w200")}
                      alt={person.name}
                      width={120}
                      height={180}
                      className="rounded-lg object-cover w-[120px] h-[180px]"
                    />
                  ) : (
                    <div className="w-[120px] h-[180px] bg-base-200 rounded-lg flex items-center justify-center">
                      <span className="text-3xl opacity-20">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium mt-2 truncate">
                    {person.name}
                  </p>
                  <p className="text-xs text-base-content/40 truncate">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
