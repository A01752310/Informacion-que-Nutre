"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, ApiError } from "@/lib/api";
import type { UserUpdate } from "@/lib/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function ProfileForm() {
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setPhone(user.phone ?? "");
      setMunicipality(user.municipality ?? "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const payload: UserUpdate = {};
      if (firstName) payload.first_name = firstName;
      if (lastName) payload.last_name = lastName;
      if (phone) payload.phone = phone;
      if (municipality) payload.municipality = municipality;

      await apiFetch("/api/v1/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      await refreshUser();
      setMessage({ type: "success", text: "Cambios guardados correctamente." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Error al guardar.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12 animate-pulse space-y-6">
        <div className="h-32 w-32 bg-surface-container-highest rounded-xl" />
        <div className="h-8 w-1/2 bg-surface-container-highest rounded" />
        <div className="h-48 bg-surface-container-highest rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* ── Sidebar ── */}
      <aside className="lg:col-span-3 space-y-2">
        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-container text-on-primary-container font-semibold" href="#">
            <Icon name="person" /> Mi Perfil
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/20 transition-all text-left"
          >
            <Icon name="logout" /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* ── Content ── */}
      <div className="lg:col-span-9 space-y-8">
        {/* Identity card */}
        <div className="p-8 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-xl bg-primary-container flex items-center justify-center">
            <Icon name="person" className="text-5xl text-on-primary-container" />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs uppercase tracking-widest mb-3">
              Miembro de la Comunidad
            </div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-none mb-2 font-headline">
              {user.first_name ?? ""} {user.last_name ?? ""}
            </h1>
            <p className="text-on-surface-variant text-sm">{user.email}</p>
          </div>
        </div>

        {/* Edit form */}
        <section className="p-8 rounded-xl bg-surface-container-low/50 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="badge" className="text-primary" />
            <h2 className="text-xl font-bold tracking-tight font-headline">
              Información Personal
            </h2>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-primary-fixed text-on-primary-fixed"
                  : "bg-error-container text-on-error-container"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Apellido"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              label="Correo Electrónico"
              type="email"
              value={user.email}
              disabled
              hint="El correo no puede ser modificado."
            />
            <Input
              label="Teléfono"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Municipio"
              type="text"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
            />
            <Button type="submit" isLoading={saving} className="w-full py-3 text-sm">
              Guardar Cambios
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
