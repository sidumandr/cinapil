"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Plus,
  Eye,
  List,
  Sun,
  Moon,
  Search,
  Menu,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSearch } from "@/context/search-context";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { query, setQuery } = useSearch();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="navbar bg-base-200/70 backdrop-blur-xl sticky top-0 z-50 border-b border-base-300 px-2 lg:px-6 gap-2 min-h-[4rem] py-0">
      {/* Brand */}
      <div className="flex-none">
        <Link href="/" className="btn btn-ghost btn-sm text-lg gap-2 px-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-primary-content" />
          </div>
          <span className="font-extrabold tracking-tight hidden sm:inline">
            Cina<span className="text-primary">pil</span>
          </span>
        </Link>
      </div>

      {/* Nav Links (left) - only for authenticated users */}
      {isAuthenticated && (
        <div className="flex-none hidden md:flex">
          <ul className="menu menu-horizontal menu-sm gap-0.5 px-0">
            <li>
              <Link
                href="/watchlist"
                className={`gap-1.5 font-medium text-sm rounded-lg ${
                  pathname === "/watchlist"
                    ? "active bg-base-300"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                İzleyeceklerim
              </Link>
            </li>
            <li>
              <Link
                href="/watched"
                className={`gap-1.5 font-medium text-sm rounded-lg ${
                  pathname === "/watched"
                    ? "active bg-base-300"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                İzlediklerim
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Search Bar (center) */}
      <div className="flex-1 px-2">
        <div className="w-full max-w-xl mx-auto">
          <div className="flex items-center w-full bg-base-100 border border-base-300 rounded-full overflow-hidden focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/30 transition-all duration-300 shadow-sm">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Film ara..."
              className="input input-sm w-full bg-transparent border-none focus:outline-none px-4 text-sm"
            />
            <button className="h-8 px-4 bg-sky-500/10 hover:bg-sky-500 text-sky-600 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-none flex items-center gap-1">
        {/* Auth Buttons */}
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm gap-1.5"
            >
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content w-6 rounded-full">
                  <span className="text-xs font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="hidden lg:inline text-sm font-medium">
                {user?.username}
              </span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300 mt-2"
            >
              <li className="menu-title px-4 py-1">
                <span className="text-xs text-base-content/40">
                  {user?.email}
                </span>
              </li>
              <li>
                <button onClick={logout} className="text-error">
                  <LogOut className="w-4 h-4" /> Çıkış Yap
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link href="/login">
              <button className="btn btn-ghost btn-sm gap-1.5 text-base-content/60">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Giriş</span>
              </button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary btn-sm gap-1.5 rounded-lg">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Kayıt Ol</span>
              </button>
            </Link>
          </div>
        )}

        {/* Mobile nav dropdown */}
        {isAuthenticated && (
          <div className="dropdown dropdown-end md:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-sm btn-circle"
            >
              <Menu className="w-4 h-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300 mt-2"
            >
              <li>
                <Link href="/" className={pathname === "/" ? "active" : ""}>
                  <List className="w-4 h-4" /> İzleyeceklerim
                </Link>
              </li>
              <li>
                <Link
                  href="/watched"
                  className={pathname === "/watched" ? "active" : ""}
                >
                  <Eye className="w-4 h-4" /> İzlediklerim
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm btn-circle"
          title={theme === "black" ? "Açık temaya geç" : "Koyu temaya geç"}
        >
          {theme === "black" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
