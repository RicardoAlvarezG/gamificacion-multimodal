"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DocenteDashboardPage() {
const [docente, setDocente] = useState({
  name: "",
  userId: "",
  tipo: "independiente",
  institucion: "",
  aulasAsignadas: 0,
});

useEffect(() => {
  const cargarDocente = async () => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) return;

    const user = JSON.parse(usuarioGuardado);

    const tipoDocente = user.institucionId
      ? "institucional"
      : "independiente";

    const res = await fetch("/api/aulas");
    const aulas = await res.json();

    const aulasFiltradas =
      tipoDocente === "institucional"
        ? aulas.filter((aula: any) => aula.docenteId === user.id)
        : aulas.filter((aula: any) => aula.creadoPorId === user.id);

    const nombreInstitucion =
      tipoDocente === "institucional"
        ? aulasFiltradas[0]?.institucion?.nombre || "Institución asignada"
        : "Docente independiente";

    setDocente({
      name: user.nombre || "",
      userId: user.usuario || "",
      tipo: tipoDocente,
      institucion: nombreInstitucion,
      aulasAsignadas: aulasFiltradas.length,
    });
  };

  cargarDocente();
}, []);

  const cards = [
    {
      icon: "🏫",
      title: "Mis aulas",
      text:
        docente.tipo === "institucional"
          ? "Visualiza las aulas asignadas por el administrador."
          : "Crea y administra tus propias aulas.",
      color: "from-sky-300 to-cyan-200",
      href: "/dashboard/docente/aulas",
    },
    {
      icon: "🧒",
      title: "Estudiantes",
      text: "Gestiona los estudiantes de tus aulas y revisa sus avatares.",
      color: "from-yellow-300 to-orange-200",
      href: "/dashboard/docente/estudiantes",
    },
    {
      icon: "🎮",
      title: "Juegos",
      text: "Crea sesiones de juego y asigna dinámicas educativas.",
      color: "from-purple-300 to-violet-200",
      href: "/dashboard/docente/juegos",
    },
    {
      icon: "📊",
      title: "Reportes",
      text: "Revisa el progreso y participación de tus estudiantes.",
      color: "from-green-300 to-emerald-200",
      href: "/dashboard/docente/reportes",
    },
    {
      icon: "🔒",
      title: "Cambiar contraseña",
      text: "Actualiza tu contraseña de acceso de forma segura.",
      color: "from-red-300 to-pink-200",
      href: "/dashboard/docente/password",
    },
  ];

  return (
    <DashboardLayout
      role="docente"
      name={docente.name}
      userId={docente.userId}
    >
      <section className="mb-6 rounded-[2rem] bg-gradient-to-br from-pink-100 via-yellow-50 to-sky-100 p-7 shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
              Panel docente
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-800">
              Bienvenido, {docente.name} 🎨
            </h2>

            <p className="mt-2 max-w-2xl font-medium text-slate-600">
              Desde aquí podrás gestionar tus aulas, estudiantes, juegos y
              actividades de participación con un entorno infantil y amigable.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Tipo de docente</p>

            <h3 className="mt-1 text-xl font-extrabold text-purple-700">
              {docente.tipo === "institucional"
                ? "Docente institucional"
                : "Docente independiente"}
            </h3>

            <p className="mt-2 text-sm font-semibold text-slate-600">
              🏫 {docente.institucion}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-600">
              📚 Aulas: {docente.aulasAsignadas}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-[2rem] bg-white/70 p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`rounded-[1.5rem] bg-gradient-to-br ${card.color} p-5 text-slate-700`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 text-5xl shadow-sm">
                {card.icon}
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-slate-800">
                {card.title}
              </h2>

              <p className="mt-2 min-h-[48px] text-sm font-medium text-slate-600">
                {card.text}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  href={card.href}
                  className="inline-block rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white"
                >
                  Ingresar
                </Link>

                {card.title === "Mis aulas" &&
                  docente.tipo === "independiente" && (
                    <Link
                      href="/dashboard/docente/aulas/crear"
                      className="inline-block rounded-2xl bg-green-400 px-4 py-2 text-sm font-bold text-green-950 transition hover:scale-105"
                    >
                      + Crear
                    </Link>
                  )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}