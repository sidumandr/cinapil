const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:5079/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cinapil-token")
      : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => apiRequest("/auth/me"),
};

// Movies
export const moviesApi = {
  getWatchlist: () => apiRequest("/movies/watchlist"),
  getWatched: () => apiRequest("/movies/watched"),

  addToWatchlist: (movie: MoviePayload) =>
    apiRequest("/movies/watchlist", {
      method: "POST",
      body: JSON.stringify(movie),
    }),

  addToWatched: (movie: MoviePayload) =>
    apiRequest("/movies/watched", {
      method: "POST",
      body: JSON.stringify(movie),
    }),

  removeFromWatchlist: (movieId: number) =>
    apiRequest(`/movies/watchlist/${movieId}`, { method: "DELETE" }),

  removeFromWatched: (movieId: number) =>
    apiRequest(`/movies/watched/${movieId}`, { method: "DELETE" }),

  moveToWatched: (movieId: number) =>
    apiRequest(`/movies/move-to-watched/${movieId}`, { method: "PUT" }),

  moveToWatchlist: (movieId: number) =>
    apiRequest(`/movies/move-to-watchlist/${movieId}`, { method: "PUT" }),
};

interface MoviePayload {
  movieId: number;
  title: string;
  originalTitle?: string;
  posterPath?: string;
  backdropPath?: string;
  overview?: string;
  voteAverage: number;
  releaseDate?: string;
}
