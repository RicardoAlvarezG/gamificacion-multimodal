interface DocenteCardProps {
  nombre: string;
  usuario: string;
  aulas: number;
  estado: "Activo";
  onDetalle?: () => void;
}

export default function DocenteCard({
  nombre,
  usuario,
  aulas,
  estado,
  onDetalle,
}: DocenteCardProps) {
  return (
    <div className="rounded-[2rem] bg-white p-7 shadow-xl border border-purple-100 transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-4xl">
          👩‍🏫
        </div>

        <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-extrabold text-green-700">
          {estado}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold text-purple-700">{nombre}</h3>

      <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
        <p>🆔 Usuario: {usuario}</p>
        <p>🏫 Aulas asignadas: {aulas}</p>
      </div>

      <button
        onClick={onDetalle}
        className="mt-7 w-full rounded-3xl bg-purple-100 px-5 py-4 font-extrabold text-purple-700 hover:bg-purple-200"
      >
        Ver detalle →
      </button>
    </div>
  );
}