import Link from "next/link";
import Icon from "@/components/ui/Icon";

/* -------------------------------------------------------
   Homepage – Server Component
   Static content faithfully recreated from Stitch export.
   Featured recipes use placeholder data since the homepage
   does not fetch from the API in MVP.
   ------------------------------------------------------- */

const featuredRecipes = [
  {
    title: "Tacos de Lentejas al Pastor",
    time: "35 min",
    servings: "4 porciones",
    cost: "$",
    image: "restaurant",
  },
  {
    title: "Ensalada de Quinoa y Frijol",
    time: "20 min",
    servings: "2 porciones",
    cost: "$$",
    image: "lunch_dining",
  },
  {
    title: "Sopa de Verduras de Temporada",
    time: "45 min",
    servings: "6 porciones",
    cost: "$",
    image: "soup_kitchen",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative px-8 py-16 md:py-28 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold tracking-widest uppercase">
              Misión Social
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold font-headline text-on-surface leading-[1.1] tracking-tight mb-8">
              Nutriendo nuestra comunidad con{" "}
              <span className="text-primary italic">conocimiento</span> y
              recetas al alcance de todos.
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/recetas"
                className="px-8 py-4 bg-secondary text-on-secondary rounded-lg font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20"
              >
                Explorar Recetas
                <Icon name="restaurant_menu" />
              </Link>
              <Link
                href="/auth?mode=register"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-surface-container-low transition-all"
              >
                Únete a la Comunidad
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl relative bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center">
              <Icon
                name="eco"
                className="text-[120px] text-primary/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Recipes ── */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-headline text-on-surface mb-2 tracking-tight">
                Recetas Destacadas
              </h2>
              <p className="text-on-surface-variant max-w-md">
                Descubre opciones nutritivas, económicas y deliciosas
                seleccionadas por nuestra comunidad.
              </p>
            </div>
            <Link
              href="/recetas"
              className="text-primary font-bold flex items-center gap-1 hover:underline"
            >
              Ver todas <Icon name="chevron_right" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredRecipes.map((r) => (
              <div
                key={r.title}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary-fixed/40 to-tertiary-fixed/40 flex items-center justify-center">
                  <Icon
                    name={r.image}
                    className="text-5xl text-primary/30 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-headline font-bold text-xl text-on-surface">
                    {r.title}
                  </h3>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-xs font-bold">
                    {r.cost}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" className="text-lg" /> {r.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="restaurant" className="text-lg" /> {r.servings}
                  </span>
                </div>
                <Link
                  href="/recetas"
                  className="block w-full py-2 bg-surface-container text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors text-center"
                >
                  Ver Receta
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workshops ── */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold font-headline text-on-surface mb-12 tracking-tight">
          Próximos Talleres
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-6 p-6 bg-surface-container rounded-3xl items-center border border-outline-variant/10">
            <div className="bg-primary text-on-primary rounded-2xl p-4 text-center min-w-[100px]">
              <div className="text-sm uppercase tracking-widest">Oct</div>
              <div className="text-4xl font-bold font-headline">24</div>
            </div>
            <div>
              <h4 className="text-xl font-bold font-headline text-primary mb-1">
                Cocina Económica y Saludable
              </h4>
              <p className="text-on-surface-variant text-sm mb-3">
                Aprende a maximizar tus ingredientes sin gastar más.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="location_on" className="text-sm" /> CDMX,
                  Iztapalapa
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="group" className="text-sm" /> 15 cupos
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 p-6 bg-surface-container rounded-3xl items-center border border-outline-variant/10">
            <div className="bg-tertiary text-on-tertiary rounded-2xl p-4 text-center min-w-[100px]">
              <div className="text-sm uppercase tracking-widest">Nov</div>
              <div className="text-4xl font-bold font-headline">02</div>
            </div>
            <div>
              <h4 className="text-xl font-bold font-headline text-tertiary mb-1">
                Tradición que Nutre
              </h4>
              <p className="text-on-surface-variant text-sm mb-3">
                Recetas ancestrales para el Día de Muertos.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Icon name="location_on" className="text-sm" /> Online
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="group" className="text-sm" /> Libre
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / Impact ── */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl shadow-md w-full aspect-square bg-gradient-to-br from-primary-fixed to-primary/20 mt-8 flex items-center justify-center">
                <Icon name="storefront" className="text-6xl text-primary/30" />
              </div>
              <div className="rounded-2xl shadow-md w-full aspect-square bg-gradient-to-br from-tertiary-fixed to-tertiary/20 flex items-center justify-center">
                <Icon name="groups" className="text-6xl text-tertiary/30" />
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface mb-6 leading-tight">
              Impacto Real en Corazón de México
            </h2>
            <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
              En{" "}
              <span className="text-primary font-bold">
                Información que Nutre
              </span>
              , creemos que una buena alimentación es un derecho, no un
              privilegio. Trabajamos mano a mano con comunidades locales para
              rescatar saberes culinarios y adaptarlos a las necesidades
              nutricionales de hoy.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-4xl font-extrabold font-headline text-primary mb-1">
                  10k+
                </div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Familias
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold font-headline text-primary mb-1">
                  500+
                </div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Recetas
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold font-headline text-primary mb-1">
                  24
                </div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Estados
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support CTA ── */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-primary mb-6">
              ¿Quieres ser parte del cambio?
            </h2>
            <p className="text-on-primary-container text-lg max-w-2xl mx-auto mb-10 opacity-90">
              Tu apoyo nos permite seguir creando contenido gratuito,
              organizando talleres y llevando salud a cada rincón de nuestra
              comunidad.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-5 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl font-bold text-xl hover:bg-tertiary-fixed-dim transition-all shadow-xl shadow-black/20">
                Donar Ahora
              </button>
              <button className="px-10 py-5 border-2 border-on-primary text-on-primary rounded-xl font-bold text-xl hover:bg-on-primary/10 transition-all">
                Ser Voluntario
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
