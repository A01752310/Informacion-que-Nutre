import RecipeGrid from "@/components/RecipeGrid";
import Icon from "@/components/ui/Icon";

/* Server component — static header + client RecipeGrid */
export default function RecetasPage() {
  return (
    <div className="pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <section className="mt-12 mb-16 space-y-4">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary font-bold">
          Patrimonio Gastronómico
        </span>
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1]">
          Recetario para la <br />
          <span className="text-primary italic">Canasta Básica</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
          Descubre cómo nutrir a tu familia con ingredientes locales, económicos
          y de alta calidad. Sabores tradicionales que cuidan tu salud y tu
          bolsillo.
        </p>
      </section>

      <RecipeGrid />

      {/* FAB */}
      <a
        href="/enviar-receta"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Icon name="add" />
      </a>
    </div>
  );
}
