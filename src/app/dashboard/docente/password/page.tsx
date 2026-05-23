import Link from "next/link";

export default function ModuloEnDesarrolloPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="min-h-[90vh] rounded-[2rem] bg-white/60 p-10 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-5xl font-extrabold text-purple-700">
              Módulo en desarrollo 🚧
            </h1>

            <p className="mt-4 text-lg text-slate-700">
              Esta funcionalidad estará disponible en una próxima versión del sistema.
            </p>
          </div>

          <Link
            href="/dashboard/docente"
            className="rounded-2xl bg-purple-500 px-8 py-4 font-bold text-white shadow-lg transition hover:scale-105"
          >
            ← Regresar
          </Link>
        </div>
      </section>
    </main>
  );
}