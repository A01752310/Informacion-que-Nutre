"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { ApiError } from "@/lib/api";

type Mode = "login" | "register";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();

  /* Login fields */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Register-only fields */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!privacyConsent) {
      setError("Debes aceptar los términos de privacidad.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        privacy_consent: privacyConsent,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al registrarse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mx-auto">
      {/* ── Left panel – branding (hidden on mobile) ── */}
      <div className="hidden lg:flex flex-col space-y-8 pr-12">
        <div className="space-y-4">
          <span className="text-primary font-bold tracking-widest uppercase text-xs">
            Bienvenido a la comunidad
          </span>
          <h1 className="text-5xl font-extrabold text-on-surface leading-tight tracking-tighter font-headline">
            Información que Nutre
          </h1>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-md">
            Transformamos el conocimiento en bienestar. Únete para compartir
            recetas, aprender de expertos y nutrir a tu comunidad.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
            <Icon name="restaurant" className="text-primary text-3xl" />
            <h3 className="font-bold text-on-surface">Recetas Reales</h3>
            <p className="text-sm text-on-surface-variant">
              Ingredientes locales y nutritivos para tu mesa.
            </p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl space-y-3">
            <Icon name="group" className="text-tertiary text-3xl" />
            <h3 className="font-bold text-on-surface">Comunidad</h3>
            <p className="text-sm text-on-surface-variant">
              Conecta con miles de personas en México.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="w-full max-w-md mx-auto">
        {/* ── LOGIN ── */}
        {mode === "login" && (
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-sm border border-outline-variant/10">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-primary mb-2 font-headline">
                Inicia Sesión
              </h2>
              <p className="text-on-surface-variant text-sm">
                Bienvenido de vuelta a nuestra cocina digital.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hint="Tu correo no será compartido con terceros."
                required
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-4 text-sm"
              >
                Inicia Sesión
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-sm text-on-surface-variant">
                ¿Aún no tienes cuenta?{" "}
                <button
                  onClick={() => { setMode("register"); setError(null); }}
                  className="text-secondary font-bold hover:underline ml-1"
                >
                  Crea una Cuenta
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── REGISTER ── */}
        {mode === "register" && (
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-sm border border-outline-variant/10">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-tertiary mb-2 font-headline">
                Crea una Cuenta
              </h2>
              <p className="text-on-surface-variant text-sm">
                Únete a la red de nutrición más grande de México.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="Mínimo 8 caracteres, una mayúscula y un número."
                required
              />

              {/* Privacy consent */}
              <div className="flex items-start space-x-3 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-on-surface-variant leading-tight cursor-pointer"
                >
                  Acepto los{" "}
                  <a href="#" className="text-primary font-medium hover:underline">
                    términos de privacidad
                  </a>{" "}
                  y el uso de mis datos para fines informativos.
                </label>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-4 text-sm !from-tertiary !to-tertiary-container"
              >
                Registrarme
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-sm text-on-surface-variant">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  Inicia Sesión
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
