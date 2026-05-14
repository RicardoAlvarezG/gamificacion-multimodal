export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 min-h-screen flex-col bg-white border-r border-slate-100 p-6">
      <div className="text-3xl font-bold text-purple-700">
        🎮 Aula Gamificada
      </div>

      <nav className="mt-10 space-y-3">
        {["Dashboard", "Aulas", "Estudiantes", "Gamificación", "Actividades", "Reportes"].map(
          (item) => (
            <button
              key={item}
              className="w-full text-left rounded-2xl px-4 py-3 font-semibold text-slate-600 hover:bg-purple-100 hover:text-purple-700 transition"
            >
              {item}
            </button>
          )
        )}
      </nav>
    </aside>
  );
}