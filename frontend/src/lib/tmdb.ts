export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=tr-TR`
  );

  if (!res.ok) throw new Error("Film arama başarısız oldu");

  const data: TMDBResponse = await res.json();
  return data.results || [];
}

export async function getPopularMovies(): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=tr-TR`
  );

  if (!res.ok) throw new Error("Popüler filmler yüklenemedi");

  const data: TMDBResponse = await res.json();
  return data.results || [];
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const res = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=tr-TR`
  );

  if (!res.ok) throw new Error("Trend filmler yüklenemedi");

  const data: TMDBResponse = await res.json();
  return data.results || [];
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface MovieCredits {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  crew: { id: number; name: string; job: string }[];
}

export async function getMovieDetails(id: number): Promise<MovieDetail> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=tr-TR`
  );
  if (!res.ok) throw new Error("Film detayları yüklenemedi");
  return res.json();
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=tr-TR`
  );
  if (!res.ok) throw new Error("Film ekibi yüklenemedi");
  return res.json();
}
