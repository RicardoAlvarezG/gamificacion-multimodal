"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role: "administrador" | "docente";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminItems = [
    {
      label: "Dashboard",
      icon: "🏠",
      href: "/dashboard/administrador",
    },
    {
      label: "Aulas",
      icon: "🏫",
      href: "/dashboard/administrador/aulas",
    },
    {
      label: "Docentes",
      icon: "👩‍🏫",
      href: "/dashboard/administrador/docentes",
    },
    {
      label: "Asignar aulas",
      icon: "📝",
      href: "/dashboard/administrador/asignar-aulas",
    },
    {
      label: "Estudiantes",
      icon: "🧒",
      href: "/dashboard/administrador/estudiantes",
    },
    {
      label: "Cambiar contraseña",
      icon: "🔒",
      href: "#",
    },
  ];

  const docenteItems = [
    {
      label: "Dashboard",
      icon: "🏠",
      href: "/dashboard/docente",
    },
    {
      label: "Aulas",
      icon: "🏫",
      href: "/dashboard/docente/aulas",
    },
    {
      label: "Estudiantes",
      icon: "🧒",
      href: "/dashboard/docente/estudiantes",
    },
    {
      label: "Juegos",
      icon: "🎮",
      href: "/dashboard/docente/gamificacion",
    },
    {
      label: "Reportes",
      icon: "📊",
      href: "/dashboard/docente/reportes",
    },
    {
      label: "Cambiar contraseña",
      icon: "🔒",
      href: "#",
    },
  ];

  const menuItems = role === "administrador" ? adminItems : docenteItems;

  return (
    <aside className="hidden lg:flex w-80 min-h-screen flex-col bg-gradient-to-b from-purple-500 via-pink-400 to-yellow-300 p-4 shadow-2xl">
      <div className="rounded-[2rem] bg-white/95 p-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 leading-tight">
          🎮 Aula
          <br />
          Gamificada
        </h1>

        <p className="mt-3 text-center text-sm font-semibold text-slate-500">
          Plataforma educativa interactiva
        </p>
      </div>

      <nav className="mt-8 flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 rounded-3xl px-5 py-4 text-left font-bold shadow-md transition hover:scale-105 ${
                isActive
                  ? "bg-purple-700 text-white"
                  : "bg-white/90 text-slate-700 hover:bg-white"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[2rem] bg-white/90 p-5 shadow-md">
        <p className="text-center text-sm font-bold text-purple-600">
          🎮 Zona de Juegos 🎮
        </p>
      </div>
    </aside>
  );
}