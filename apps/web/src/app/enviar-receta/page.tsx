import RecipeSubmissionForm from "@/components/RecipeSubmissionForm";

/* Server page shell for /enviar-receta */
export default function EnviarRecetaPage() {
  return (
    <div className="pb-20 px-6 max-w-5xl mx-auto">
      <header className="mb-12 pt-4">
        <h1 className="text-5xl md:text-6xl font-extrabold font-headline text-primary tracking-tighter mb-4 leading-tight">
          Comparte tu Sazón
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Contribuye a nuestra comunidad compartiendo recetas saludables y
          tradicionales. Tu conocimiento ayuda a nutrir a México.
        </p>
      </header>
      <RecipeSubmissionForm />
    </div>
  );
}
