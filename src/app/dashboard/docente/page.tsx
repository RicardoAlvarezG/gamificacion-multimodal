import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DocenteDashboardPage() {
  const cards = [
    {
      icon: "🏫",
      title: "Aulas",
      text: "Gestiona tus aulas asignadas o creadas.",
      color: "from-sky-400 to-cyan-300",
    },
    {
      icon: "🧒",
      title: "Estudiantes",
      text: "Administra los estudiantes de tus aulas.",
      color: "from-yellow-400 to-orange-300",
    },
    {
      icon: "📊",
      title: "Reportes",
      text: "Revisa el progreso y participación de tus estudiantes.",
      color: "from-green-400 to-emerald-300",
    },
    {
      icon: "🔒",
      title: "Cambiar contraseña",
      text: "Actualiza tu contraseña de acceso de forma segura.",
      color: "from-red-400 to-pink-300",
    },
    {
      icon: "🎮",
      title: "Juegos",
      text: "Accede a juegos y dinámicas educativas para el aula.",
      color: "from-purple-400 to-violet-300",
    },
  ];

  return (
    <DashboardLayout
      role="docente"
      name="Carlos Mendoza"
      userId="DOC001"
    >
      <section className="mb-6 rounded-[2rem] bg-white/80 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-800">
          Bienvenido al panel docente 🎨
        </h2>

        <p className="mt-2 text-slate-500 font-medium">
          Desde aquí podrás gestionar tus aulas, estudiantes, juegos y reportes
          de participación.
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

              <h2 className="mt-5 text-xl font-extrabold">
                {card.title}
              </h2>

              <p className="mt-2 text-sm font-medium text-white/90">
                {card.text}
              </p>

              <button className="mt-5 rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white transition">
                Ingresar
              </button>
            </div>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
}