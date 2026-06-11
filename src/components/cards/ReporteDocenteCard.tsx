import Link from "next/link";

interface ReporteDocenteCardProps {
  id: number;
  nombre: string;
  aulas: number;
  estudiantes: number;
  porcentaje: number;
  estado: string;
}
export default function ReporteDocenteCard({
  id,
  nombre,
  aulas,
  estudiantes,
  porcentaje,
  estado,
}: ReporteDocenteCardProps) {
  const colorEstado =
    estado === "DESTACADO"
      ? "bg-green-100 text-green-700"
      : estado === "LOGRADO"
      ? "bg-blue-100 text-blue-700"
      : estado === "EN PROCESO"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-purple-100 transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-4xl">
          👩‍🏫
        </div>

        <span
          className={`rounded-full px-4 py-2 text-xs font-extrabold ${colorEstado}`}
        >
          {estado}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold text-purple-700">{nombre}</h3>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
          <span>Progreso General</span>
          <span>{porcentaje}%</span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-purple-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm font-semibold text-slate-600">
        <p>🏫 Aulas: {aulas}</p>
        <p>👦 Estudiantes: {estudiantes}</p>
      </div>

      <Link
        href={`/dashboard/administrador/reportes/docente/${id}`}
        className="mt-8 block w-full rounded-3xl bg-purple-100 px-5 py-4 text-center font-extrabold text-purple-700 transition hover:bg-purple-200"
        >
        Ver Reporte →
      </Link>
    </div>
  );
}