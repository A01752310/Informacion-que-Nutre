"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import type { Recipe } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

function difficultyLabel(d?: string | null) {
  if (d === "easy") return "Fácil";
  if (d === "medium") return "Dificultad Media";
  if (d === "hard") return "Difícil";
  return null;
}

export default function RecipeContent({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Recipe>(`/api/v1/recipes/${id}`)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse space-y-8">
        <div className="h-12 w-2/3 bg-surface-container-highest rounded" />
        <div className="h-96 bg-surface-container-highest rounded-xl" />
        <div className="h-64 bg-surface-container-highest rounded-xl" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Icon name="error" className="text-6xl text-error mb-4" />
        <h2 className="text-2xl font-bold mb-2">Receta no encontrada</h2>
        <p className="text-on-surface-variant">
          {error ?? "No pudimos cargar esta receta."}
        </p>
      </div>
    );
  }

  const difficulty = difficultyLabel(recipe.difficulty);

  /* Parse instructions into steps (split by newline + optional numbering) */
  const steps = recipe.instructions
    ? recipe.instructions
        .split(/\n+/)
        .map((s) => s.replace(/^\d+[\.\)\-]\s*/, "").trim())
        .filter(Boolean)
    : [];

  return (
    <>
      {/* ── Hero Header ── */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="mb-6 flex flex-wrap gap-3">
              {difficulty && (
                <Badge variant="approved">{difficulty}</Badge>
              )}
              {recipe.estimated_cost != null && (
                <Badge variant="info">
                  {recipe.estimated_cost <= 50
                    ? "Bajo Costo"
                    : recipe.estimated_cost <= 150
                    ? "Costo Medio"
                    : "Costo Alto"}
                </Badge>
              )}
              {recipe.prep_time_minutes != null && (
                <Badge variant="pending">{recipe.prep_time_minutes} Mins</Badge>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6 font-headline">
              {recipe.title}
            </h1>
            {recipe.author_id && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-surface-container-low rounded-xl inline-flex">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <Icon name="person" className="text-on-primary-container" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-widest">
                    Receta compartida por
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {recipe.source_type === "user_submitted"
                      ? "Comunidad"
                      : "Institución"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-5 h-full">
            <div className="relative h-96 lg:h-full rounded-xl overflow-hidden shadow-2xl shadow-primary/10 bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center">
              <Icon name="restaurant" className="text-[120px] text-primary/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-16">
          {/* Description */}
          {recipe.description && (
            <section className="bg-surface-container-low p-10 rounded-xl">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 font-headline">
                <Icon name="info" className="text-primary" />
                Descripción
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {recipe.description}
              </p>
            </section>
          )}

          {/* Instructions */}
          {steps.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 font-headline">
                <Icon name="cooking" className="text-primary" />
                Instrucciones de Preparación
              </h2>
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-8">
                    <div className="flex-none w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-lg text-on-surface-variant leading-relaxed">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipe.servings != null && (
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Porciones
                </p>
                <p className="font-bold">{recipe.servings}</p>
              </div>
            )}
            {recipe.prep_time_minutes != null && (
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Tiempo
                </p>
                <p className="font-bold">{recipe.prep_time_minutes} min</p>
              </div>
            )}
            {recipe.estimated_cost != null && (
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Costo Estimado
                </p>
                <p className="font-bold">${recipe.estimated_cost}</p>
              </div>
            )}
            {recipe.difficulty && (
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Dificultad
                </p>
                <p className="font-bold">{difficultyLabel(recipe.difficulty)}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
