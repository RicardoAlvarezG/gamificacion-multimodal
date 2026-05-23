interface SolicitudDocenteCardProps {
  id: number;
  nombre: string;
  usuario: string;
  codigo: string;
  onAprobar: (id: number) => void;
}

export default function SolicitudDocenteCard({
  id,
  nombre,
  usuario,
  codigo,
  onAprobar,
}: SolicitudDocenteCardProps) {
  return (
    <div className="rounded-[2rem] bg-white p-7 shadow-xl border border-yellow-100 transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-4xl">
          ⏳
        </div>

        <span className="rounded-full bg-yellow-100 px-4 py-2 text-xs font-extrabold text-yellow-700">
          Pendiente
        </span>
      </div>

      <h3 className="text-2xl font-extrabold text-purple-700">{nombre}</h3>

      <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
        <p>🆔 Usuario: {usuario}</p>
        <p>🏷️ Código usado: {codigo}</p>
      </div>

      <div className="mt-7 flex gap-3">
        <button
          onClick={() => onAprobar(id)}
          className="w-full rounded-3xl bg-green-100 px-4 py-4 font-extrabold text-green-700 hover:bg-green-200"
        >
          Aceptar
        </button>

        <button className="w-full rounded-3xl bg-red-100 px-4 py-4 font-extrabold text-red-700 hover:bg-red-200">
          Rechazar
        </button>
      </div>
    </div>
  );
}