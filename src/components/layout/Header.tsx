export default function Header() {
  return (
    <header className="bg-white rounded-3xl shadow-sm p-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Panel principal
        </h1>
        <p className="text-slate-500">
          Bienvenido al sistema de gamificación educativa
        </p>
      </div>

      <div className="rounded-2xl bg-purple-100 px-4 py-3 font-semibold text-purple-700">
        👩‍🏫 Docente
      </div>
    </header>
  );
}