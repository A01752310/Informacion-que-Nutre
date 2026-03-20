import VideoSubmissionForm from "@/components/VideoSubmissionForm";

/* Server page shell for /enviar-video */
export default function EnviarVideoPage() {
  return (
    <div className="pb-24 px-6 max-w-4xl mx-auto pt-8">
      <header className="mb-12 text-center md:text-left">
        <span className="text-xs uppercase tracking-widest text-tertiary mb-3 block font-bold">
          Subir videos
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight mb-4">
          Comparte tu Sabiduría Culinaria
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Ayúdanos a nutrir a la comunidad compartiendo videos que enseñen
          técnicas saludables, recetas tradicionales o consejos de nutrición.
        </p>
      </header>
      <VideoSubmissionForm />
    </div>
  );
}
