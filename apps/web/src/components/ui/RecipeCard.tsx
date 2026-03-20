import Link from "next/link";
import Badge from "./Badge";
import Icon from "./Icon";
import type { Recipe } from "@/lib/types";

/** Map difficulty enum to Spanish label. */
function difficultyLabel(d?: string | null) {
  if (d === "easy") return "Fácil";
  if (d === "medium") return "Media";
  if (d === "hard") return "Difícil";
  return null;
}

/** Map source_type to badge color & label. */
function sourceLabel(s?: string | null) {
  if (s === "user_submitted") return { label: "Comunidad", bg: "bg-primary text-on-primary" };
  return { label: "Institución", bg: "bg-secondary text-on-secondary" };
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const source = sourceLabel(recipe.source_type);
  const difficulty = difficultyLabel(recipe.difficulty);

  return (
    <Link href={`/recetas/${recipe.id}`}>
      <article className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow hover:-translate-y-1 transition-transform group cursor-pointer">
        {/* Image placeholder — replace with real image CDN when available */}
        <div className="h-64 overflow-hidden relative bg-surface-container-high">
          <div className="w-full h-full bg-gradient-to-br from-primary-fixed/30 to-tertiary-fixed/30 flex items-center justify-center">
            <Icon name="restaurant" className="text-6xl text-primary/20" />
          </div>
          <div className="absolute top-4 left-4">
            <span className={`${source.bg} text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full`}>
              {source.label}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {recipe.estimated_cost != null && (
              <Badge variant="cost">
                Costo: {"$".repeat(Math.min(Math.ceil(recipe.estimated_cost / 50), 3) || 1)}
              </Badge>
            )}
            {recipe.prep_time_minutes != null && (
              <Badge variant="time">{recipe.prep_time_minutes} min</Badge>
            )}
            {difficulty && <Badge variant="difficulty">{difficulty}</Badge>}
          </div>

          <h3 className="font-headline text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
