"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { Movie } from "@/lib/tmdb";
import { moviesApi } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

// State
interface MovieState {
  watchlist: Movie[];
  watched: Movie[];
}

// Actions
type MovieAction =
  | { type: "SET_WATCHLIST"; payload: Movie[] }
  | { type: "SET_WATCHED"; payload: Movie[] }
  | { type: "ADD_TO_WATCHLIST"; payload: Movie }
  | { type: "ADD_TO_WATCHED"; payload: Movie }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: number }
  | { type: "REMOVE_FROM_WATCHED"; payload: number }
  | { type: "MOVE_TO_WATCHED"; payload: number }
  | { type: "MOVE_TO_WATCHLIST"; payload: number };

function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case "SET_WATCHLIST":
      return { ...state, watchlist: action.payload };
    case "SET_WATCHED":
      return { ...state, watched: action.payload };
    case "ADD_TO_WATCHLIST":
      return { ...state, watchlist: [action.payload, ...state.watchlist] };
    case "ADD_TO_WATCHED":
      return { ...state, watched: [action.payload, ...state.watched] };
    case "REMOVE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter((m) => m.id !== action.payload),
      };
    case "REMOVE_FROM_WATCHED":
      return {
        ...state,
        watched: state.watched.filter((m) => m.id !== action.payload),
      };
    case "MOVE_TO_WATCHED": {
      const movie = state.watchlist.find((m) => m.id === action.payload);
      if (!movie) return state;
      return {
        watchlist: state.watchlist.filter((m) => m.id !== action.payload),
        watched: [movie, ...state.watched],
      };
    }
    case "MOVE_TO_WATCHLIST": {
      const movie = state.watched.find((m) => m.id === action.payload);
      if (!movie) return state;
      return {
        watched: state.watched.filter((m) => m.id !== action.payload),
        watchlist: [movie, ...state.watchlist],
      };
    }
    default:
      return state;
  }
}

// Context
interface MovieContextValue extends MovieState {
  addToWatchlist: (movie: Movie) => void;
  addToWatched: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  removeFromWatched: (id: number) => void;
  moveToWatched: (id: number) => void;
  moveToWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  isInWatched: (id: number) => boolean;
}

const MovieContext = createContext<MovieContextValue | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const mountedRef = useRef(false);

  const [state, dispatch] = useReducer(movieReducer, {
    watchlist: [],
    watched: [],
  });

  // Load data from API or localStorage
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      // Fetch from API
      Promise.all([moviesApi.getWatchlist(), moviesApi.getWatched()])
        .then(([watchlist, watched]) => {
          dispatch({ type: "SET_WATCHLIST", payload: watchlist });
          dispatch({ type: "SET_WATCHED", payload: watched });
        })
        .catch(console.error)
        .finally(() => {
          mountedRef.current = true;
        });
    } else {
      // Fallback to localStorage
      try {
        const wl = JSON.parse(localStorage.getItem("cinapil-watchlist") || "[]");
        const w = JSON.parse(localStorage.getItem("cinapil-watched") || "[]");
        dispatch({ type: "SET_WATCHLIST", payload: wl });
        dispatch({ type: "SET_WATCHED", payload: w });
      } catch {
        /* ignore */
      }
      mountedRef.current = true;
    }
  }, [isAuthenticated, authLoading]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!mountedRef.current || isAuthenticated) return;
    localStorage.setItem("cinapil-watchlist", JSON.stringify(state.watchlist));
    localStorage.setItem("cinapil-watched", JSON.stringify(state.watched));
  }, [state, isAuthenticated]);

  const movieToPayload = (movie: Movie) => ({
    movieId: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path ?? undefined,
    backdropPath: movie.backdrop_path ?? undefined,
    overview: movie.overview,
    voteAverage: movie.vote_average,
    releaseDate: movie.release_date,
  });

  const addToWatchlist = useCallback((movie: Movie) => {

    if (state.watchlist.some((m) => m.id === movie.id)) return;

    dispatch({ type: "ADD_TO_WATCHLIST", payload: movie });
    if (isAuthenticated) {
      moviesApi.addToWatchlist(movieToPayload(movie)).catch(console.error);
    }
  }, [isAuthenticated, state.watchlist]);

  const addToWatched = useCallback((movie: Movie) => {

    if (state.watched.some((m) => m.id === movie.id)) return;

    dispatch({ type: "ADD_TO_WATCHED", payload: movie });
    if (isAuthenticated) {
      moviesApi.addToWatched(movieToPayload(movie)).catch(console.error);
    }
  }, [isAuthenticated, state.watched]);

  const removeFromWatchlist = useCallback((id: number) => {
    dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: id });
    if (isAuthenticated) {
      moviesApi.removeFromWatchlist(id).catch(console.error);
    }
  }, [isAuthenticated]);

  const removeFromWatched = useCallback((id: number) => {
    dispatch({ type: "REMOVE_FROM_WATCHED", payload: id });
    if (isAuthenticated) {
      moviesApi.removeFromWatched(id).catch(console.error);
    }
  }, [isAuthenticated]);

  const moveToWatched = useCallback((id: number) => {
    dispatch({ type: "MOVE_TO_WATCHED", payload: id });
    if (isAuthenticated) {
      moviesApi.moveToWatched(id).catch(console.error);
    }
  }, [isAuthenticated]);

  const moveToWatchlist = useCallback((id: number) => {
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: id });
    if (isAuthenticated) {
      moviesApi.moveToWatchlist(id).catch(console.error);
    }
  }, [isAuthenticated]);

  const isInWatchlist = useCallback(
    (id: number) => state.watchlist.some((m) => m.id === id),
    [state.watchlist]
  );

  const isInWatched = useCallback(
    (id: number) => state.watched.some((m) => m.id === id),
    [state.watched]
  );

  return (
    <MovieContext.Provider
      value={{
        ...state,
        addToWatchlist,
        addToWatched,
        removeFromWatchlist,
        removeFromWatched,
        moveToWatched,
        moveToWatchlist,
        isInWatchlist,
        isInWatched,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}
