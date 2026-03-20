import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full border-t border-outline-variant/15">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="space-y-4">
          <div className="text-lg font-bold text-primary tracking-tighter font-headline">
            Información que Nutre
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">
            Promoviendo la salud alimentaria a través del conocimiento compartido
            y la comunidad.
          </p>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h5 className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
            Legal
          </h5>
          <Link
            href="#"
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-primary-container transition-colors"
          >
            Aviso de Privacidad
          </Link>
          <Link
            href="#"
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-primary-container transition-colors"
          >
            Términos de Servicio
          </Link>
          <Link
            href="#"
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-primary-container transition-colors"
          >
            Contacto
          </Link>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-3">
          <h5 className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
            Redes Sociales
          </h5>
          <Link
            href="#"
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-primary-container transition-colors"
          >
            Instagram
          </Link>
          <Link
            href="#"
            className="text-xs uppercase tracking-widest text-stone-500 hover:text-primary-container transition-colors"
          >
            Facebook
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs uppercase tracking-widest text-stone-500">
          © 2024 Información que Nutre. Nutriendo comunidades en México.
        </span>
      </div>
    </footer>
  );
}
