import ModerationPanel from "@/components/ModerationPanel";
import Icon from "@/components/ui/Icon";

/* Server page shell for /moderacion */
export default function ModeracionPage() {
  return (
    <div className="pb-16 px-6 max-w-6xl mx-auto pt-4">
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
            <Icon name="admin_panel_settings" className="text-on-primary-container text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-headline text-on-surface tracking-tight">
              Panel de Moderación
            </h1>
            <p className="text-on-surface-variant text-sm">
              Revisa y gestiona las contribuciones de la comunidad.
            </p>
          </div>
        </div>
      </header>
      <ModerationPanel />
    </div>
  );
}
