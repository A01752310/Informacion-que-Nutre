"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, ApiError } from "@/lib/api";
import type { Recipe, RecipeVideo } from "@/lib/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function VideoSubmissionForm() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth");
  }, [isLoading, isAuthenticated, router]);

  /* Fetch published recipes for the association dropdown */
  useEffect(() => {
    apiFetch<Recipe[]>("/api/v1/recipes?limit=100")
      .then(setRecipes)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!youtubeUrl.trim()) {
      setError("La URL de YouTube es obligatoria.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch<RecipeVideo>("/api/v1/recipes/videos", {
        method: "POST",
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          recipe_id: recipeId || undefined,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al enviar video.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-24">
        <div className="w-24 h-24 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="check_circle" className="text-5xl text-primary" filled />
        </div>
        <h2 className="text-3xl font-bold font-headline text-on-surface mb-4">
          ¡Video enviado!
        </h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8">
          Tu video ha sido enviado a moderación. Aparecerá en el portal tras ser
          revisado por nuestro equipo.
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setYoutubeUrl(""); setRecipeId(""); }}>
          Enviar otro video
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* ── Form ── */}
      <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 editorial-shadow">
        {error && (
          <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-headline">
              URL de YouTube
            </label>
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              hint="Solo enlaces públicos de YouTube o Shorts."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-2 font-headline">
              Vincular a una Receta
            </label>
            <select
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              className="w-full bg-surface-container-high border-transparent rounded-lg px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
            >
              <option value="">Selecciona una receta existente...</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Moderation note */}
          <div className="bg-surface-container-low p-5 rounded-lg border-l-4 border-primary/20">
            <div className="flex gap-4">
              <Icon name="info" className="text-primary-container" />
              <div className="text-sm text-on-surface-variant leading-snug">
                <p className="font-semibold text-primary mb-1">
                  Proceso de Moderación
                </p>
                Moderamos todos los videos para asegurar que el contenido sea
                útil y respetuoso. Tu video aparecerá en el portal tras ser
                revisado por nuestro equipo de nutricionistas.
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={submitting} className="w-full py-5 text-sm">
            <Icon name="rocket_launch" /> Compartir Video
          </Button>
        </form>
      </div>

      {/* ── Sidebar ── */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-surface-container-high rounded-xl overflow-hidden aspect-video relative flex items-center justify-center">
          <div className="bg-primary/90 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl">
            <Icon name="play_arrow" className="text-3xl" />
          </div>
        </div>

        <div className="p-6 bg-surface-container rounded-xl">
          <h3 className="font-headline font-bold text-primary mb-4">
            Guía de Publicación
          </h3>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            {[
              { icon: "restaurant", text: "Enfoque en ingredientes locales y accesibles." },
              { icon: "timer", text: "Idealmente entre 2 y 10 minutos de duración." },
              { icon: "volunteer_activism", text: "Lenguaje claro, inclusivo y educativo." },
            ].map((item) => (
              <li key={item.icon} className="flex gap-3">
                <Icon name={item.icon} className="text-tertiary text-lg" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
