"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, ApiError } from "@/lib/api";
import type { RecipeSubmission } from "@/lib/types";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function RecipeSubmissionForm() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth");
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !instructions.trim()) {
      setError("El título y las instrucciones son obligatorios.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch<RecipeSubmission>("/api/v1/recipes/submissions", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          instructions,
          suggested_youtube_url: youtubeUrl || undefined,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al enviar.");
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
          ¡Receta enviada!
        </h2>
        <p className="text-on-surface-variant max-w-md mx-auto mb-8">
          Tu receta ha sido enviada a revisión. Nuestro equipo editorial la
          revisará en un plazo de 24-48 horas.
        </p>
        <Button variant="outline" onClick={() => { setSubmitted(false); setTitle(""); setDescription(""); setInstructions(""); setYoutubeUrl(""); }}>
          Enviar otra receta
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* ── Main Form ── */}
      <div className="lg:col-span-2 space-y-10">
        <section className="bg-surface-container-low p-8 md:p-12 rounded-xl">
          {error && (
            <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Título de la Receta *"
              type="text"
              placeholder="Ej. Pozole Verde de Guerrero"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              hint="Usa un nombre descriptivo y tradicional."
              className="font-headline text-lg font-medium"
              required
            />
            <Textarea
              label="Breve Descripción"
              placeholder="Una breve introducción que enamore al lector..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Textarea
              label="Instrucciones Detalladas *"
              placeholder={"1. Comienza por lavar los ingredientes...\n2. En una olla grande..."}
              rows={8}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
            <Input
              label="Enlace de YouTube (Opcional)"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="submit" isLoading={submitting} className="flex-1 py-4 text-sm uppercase tracking-wider">
                Enviar a Revisión
              </Button>
            </div>
          </form>
        </section>
      </div>

      {/* ── Sidebar ── */}
      <aside className="space-y-6">
        {/* Editorial process info */}
        <div className="bg-tertiary-fixed p-8 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-on-tertiary-fixed">
              <Icon name="verified_user" className="text-2xl" filled />
              <h3 className="font-headline font-bold text-lg">
                Proceso Editorial
              </h3>
            </div>
            <p className="text-on-tertiary-fixed-variant leading-relaxed text-sm">
              Tu receta será revisada por nuestro equipo editorial para asegurar
              que cumpla con los estándares de nutrición y claridad.
            </p>
            <p className="text-on-tertiary-fixed-variant font-bold mt-4 text-xs italic">
              * Tiempo estimado de revisión: 24-48 horas.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Icon name="restaurant_menu" className="text-[120px]" filled />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-surface-container border border-outline-variant/10 p-8 rounded-xl">
          <h3 className="font-headline font-bold text-primary mb-6 flex items-center gap-2">
            <Icon name="lightbulb" className="text-xl" />
            Tips para el éxito
          </h3>
          <ul className="space-y-6">
            {[
              "Usa ingredientes locales y de temporada.",
              "Sé específico con las porciones y tiempos.",
              "Una buena foto aumenta 3x las visitas.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-xs font-bold">
                  {i + 1}
                </div>
                <p className="text-sm text-on-surface-variant font-medium">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
