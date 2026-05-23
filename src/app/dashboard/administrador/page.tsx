"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdministradorDashboardPage() {
  const [admin, setAdmin] = useState({
    name: "",
    userId: "",
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);

      setAdmin({
        name: user.nombre || "",
        userId: user.usuario || "",
      });
    }
  }, []);

  const cards = [
    {
      icon: "⏳",
      title: "Solicitudes pendientes",
      text: "Docentes esperando aprobación institucional.",
      color: "from-pink-400 to-rose-300",
      href: "/dashboard/administrador/docentes"
    },
    {
      icon: "👩‍🏫",
      title: "Docentes registrados",
      text: "Gestiona docentes activos dentro del sistema.",
      color: "from-purple-400 to-violet-300",
      href: "/dashboard/administrador/docentes"
    },
    {
      icon: "🏫",
      title: "Aulas",
      text: "Administra aulas y secciones disponibles.",
      color: "from-sky-400 to-cyan-300",
      href: "/dashboard/administrador/aulas"
    },
    {
      icon: "🧒",
      title: "Estudiantes",
      text: "Gestiona estudiantes vinculados a las aulas.",
      color: "from-yellow-400 to-orange-300",
      href: "/dashboard/administrador/estudiantes"
    },
    {
      icon: "📊",
      title: "Reportes generales",
      text: "Visualiza estadísticas y desempeño institucional.",
      color: "from-green-400 to-emerald-300",
      href: "/dashboard/administrador/reportes"
    },
    {
      icon: "🔒",
      title: "Cambiar contraseña",
      text: "Actualiza tu contraseña de acceso de forma segura.",
      color: "from-indigo-400 to-blue-300",
      href: "/dashboard/administrador/cambiar-password"
    },
  ];

  return (
    <DashboardLayout
      role="administrador"
      name={admin.name}
      userId={admin.userId}
    >
      <section className="mb-6 rounded-[2rem] bg-white/80 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-800">
          Bienvenido al panel administrativo 🌈
        </h2>
        <p className="mt-2 text-slate-500 font-medium">
          Desde aquí podrás gestionar docentes, aulas, estudiantes y reportes
          generales de la institución.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-[2rem] bg-white p-4 shadow-md hover:-translate-y-1 hover:shadow-xl transition"
          >
            <div
              className={`rounded-[1.5rem] bg-gradient-to-br ${card.color} p-5 text-white`}
            >
              <div className="text-5xl">{card.icon}</div>

              <h2 className="mt-5 text-xl font-extrabold">{card.title}</h2>

              <p className="mt-2 text-sm font-medium text-white/90">
                {card.text}
              </p>

              <Link
                href={card.href}
                className="mt-5 inline-block rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white transition"
              >
                Ingresar
              </Link>
            </div>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}