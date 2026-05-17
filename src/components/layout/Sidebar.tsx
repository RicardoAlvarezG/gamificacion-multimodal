interface SidebarProps {
  role: "administrador" | "docente";
}

export default function Sidebar({ role }: SidebarProps) {
  const adminItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Solicitudes pendientes", icon: "⏳" },
    { label: "Docentes registrados", icon: "👩‍🏫" },
    { label: "Aulas", icon: "🏫" },
    { label: "Estudiantes", icon: "🧒" },
    { label: "Reportes generales", icon: "📊" },
    { label: "Cambiar contraseña", icon: "🔒" },
  ];

  const docenteItems = [
    { label: "Aulas", icon: "🏫" },
    { label: "Estudiantes", icon: "🧒" },
    { label: "Reportes", icon: "📊" },
    { label: "Cambiar contraseña", icon: "🔒" },
    { label: "Juegos", icon: "🎮" },
  ];

  const menuItems = role === "administrador" ? adminItems : docenteItems;

  return (
    <aside className="hidden lg:flex w-80 min-h-screen flex-col bg-gradient-to-b from-purple-500 via-pink-400 to-yellow-300 p-4 shadow-2xl">
      
      {/* Logo */}
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

      {/* Menu */}
      <nav className="mt-8 flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-4 rounded-3xl bg-white/90 px-5 py-4 text-left font-bold text-slate-700 shadow-md hover:scale-105 hover:bg-white transition"
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* decoración inferior */}
      <div className="mt-auto rounded-[2rem] bg-white/90 p-5 shadow-md">
        <p className="text-center text-sm font-bold text-purple-600">
          🎮 Zona de Juegos 🎮
        </p>
      </div>
    </aside>
  );
}