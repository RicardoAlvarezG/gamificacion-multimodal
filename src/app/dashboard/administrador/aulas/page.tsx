import Link from "next/link";
import AulaCard from "@/components/cards/AulaCard";

export default function AulasPage() {
  return (
    <div className="mx-10 mt-8 min-h-[82vh] rounded-[3rem] bg-white/90 p-12 shadow-2xl border border-white/70">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-6xl">🏫</div>

          <div>
            <h1 className="text-5xl font-extrabold text-purple-700">
              Mis aulas
            </h1>
            <p className="mt-3 text-lg font-medium text-slate-600">
              Visualiza y administra las aulas creadas.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/administrador"
          className="rounded-3xl bg-purple-600 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-purple-700 hover:-translate-y-1"
        >
          ← Regresar
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <AulaCard
          name="Inicial 4 años"
          docente="María Pérez"
          turno="Mañana"
          estado="Activa"
          emoji="🐰"
        />

        <AulaCard
          name="Inicial 5 años"
          docente="Docente en espera"
          turno="Tarde"
          estado="Docente en espera"
          emoji="🧸"
        />

        <div className="flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-purple-300 bg-white p-8 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-7xl font-extrabold text-purple-600">
            +
          </div>

          <h2 className="mt-8 text-3xl font-extrabold text-purple-700">
            Crear aula
          </h2>

          <p className="mt-4 text-center text-lg font-medium text-slate-600">
            Agrega una nueva aula
          </p>
        </div>
      </div>
    </div>
  );
}