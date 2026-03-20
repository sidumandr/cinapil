"use client";

import { MovieCarousel } from "@/components/movie-carousel";
import { TrendingUp, ListCollapse, FilmIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      <MovieCarousel />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="badge rounded-2xl gap-2 py-3 px-4 mb-4">
            Keşfet & Listele
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Hoş Geldiniz
          </h1>
          <p className="mt-4 text-base sm:text-lg text-base-content/50 max-w-xl mx-auto">
            Sınırsız film, dizi ve şovları listeleyin.
            <br />
            İzlediyseniz izlediklerinize, izlemediyseniz izleyeceklerinize
            ekleyin.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body items-center text-center p-6">
              <FilmIcon className="w-8 h-8 mb-2" />
              <h3 className="card-title text-base">Film Keşfet</h3>
              <p className="text-sm text-base-content/50">
                Yukarıdaki arama çubuğundan binlerce filmi keşfedin
              </p>
            </div>
          </div>
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body items-center text-center p-6">
              <ListCollapse className="w-8 h-8 text-success mb-2" />
              <h3 className="card-title text-base">Listeleri Yönetin</h3>
              <p className="text-sm text-base-content/50">
                İzleyeceklerinizi ve izlediklerinizi takip edin
              </p>
            </div>
          </div>
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body items-center text-center p-6">
              <TrendingUp className="w-8 h-8 text-warning mb-2" />
              <h3 className="card-title text-base">Popüler Filmler</h3>
              <p className="text-sm text-base-content/50">
                Haftanın trend filmlerini görün
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
