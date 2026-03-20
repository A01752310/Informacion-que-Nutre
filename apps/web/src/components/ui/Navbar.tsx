"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Icon from "./Icon";

const navLinks = [
  { href: "/recetas", label: "Recetas" },
  { href: "/enviar-receta", label: "Subir Receta", auth: true },
  { href: "/moderacion", label: "Moderación", auth: true },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm shadow-primary/5">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-tighter font-headline"
        >
          Información que Nutre
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-headline text-sm tracking-tight">
          {navLinks.map((link) => {
            if (link.auth && !isAuthenticated) return null;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-stone-600 hover:text-primary transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/perfil"
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors"
              >
                <Icon name="person" />
              </Link>
              <button
                onClick={logout}
                className="text-sm text-on-surface-variant hover:text-error transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-all active:scale-[0.98]"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
