"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { Recipe } from "@/lib/types";
import RecipeCard from "@/components/ui/RecipeCard";
import LoadingState from "@/components/ui/LoadingState";
import EmptyState from "@/components/ui/EmptyState";

export default function RecipeGrid() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* TODO: search/filter state — backend does not support query params yet.
     The filter UI below is visual-only; wire up once the API adds filters. */
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch<Recipe[]>("/api/v1/recipes?limit=50")
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  /* Client-side filtering placeholder */
  const filtered = search
    ? recipes.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      )
    : recipes;

  return (
    <>
      {/* ── Search & Filter Bar ── */}
      <section className="sticky top-20 z-40 bg-surface/95 backdrop-blur-sm py-6 mb-12">
        <div className="bg-surface-container-low p-2 rounded-2xl flex flex-col lg:flex-row gap-2 shadow-sm border border-outline-variant/15">
          <div className="flex-grow relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline/60"
              placeholder="Buscar ingrediente o receta..."
            />
          </div>
          {/* Visual-only filter dropdowns — backend filters not yet available */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select className="bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-sm font-medium">
              <option>Dificultad</option>
              <option>Fácil</option>
              <option>Medio</option>
              <option>Difícil</option>
            </select>
            <select className="bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-sm font-medium">
              <option>Costo</option>
              <option>$</option>
              <option>$$</option>
              <option>$$$</option>
            </select>
            <select className="bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-sm font-medium">
              <option>Tiempo</option>
              <option>15 min</option>
              <option>30 min</option>
              <option>60+ min</option>
            </select>
            <select className="bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary text-sm font-medium">
              <option>Fuente</option>
              <option>Comunidad</option>
              <option>Institución</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Recipe Grid ── */}
      {error && (
        <div className="text-center py-12 text-error">
          <p>Error al cargar recetas: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <LoadingState count={6} />
        ) : filtered.length > 0 ? (
          filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title="No encontramos lo que buscas"
              message="Prueba ajustando los filtros o usando palabras clave más generales."
              action={
                search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                  >
                    Limpiar Filtros
                  </button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
