import Link from "next/link";

interface ReporteDocenteCardProps {
  id: number;
  nombre: string;
  aulas: number;
  estudiantes: number;

}
export default function ReporteDocenteCard({
  id,
  nombre,
  aulas,
  estudiantes,
  
}: ReporteDocenteCardProps) {
  

  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-purple-100 transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-4xl">
          👩‍🏫
        </div>
      
      </div>

      <h3 className="text-2xl font-extrabold text-purple-700">{nombre}</h3>



      <div className="mt-8 space-y-4 text-lg font-bold text-slate-700">
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