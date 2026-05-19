interface AulaCardProps {
  name: string;
  docente: string;
  turno: "Mañana" | "Tarde";
  estado: "Activa" | "Docente en espera";
  emoji?: string;
}

export default function AulaCard({
  name,
  docente,
  turno,
  estado,
  emoji = "🐰",
}: AulaCardProps) {
  return (
    <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-7 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl">
      <div className="absolute bottom-0 left-0 h-28 w-full rounded-t-[50%] bg-purple-100/50" />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-4xl shadow-inner">
            {emoji}
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-extrabold ${
              estado === "Activa"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {estado}
          </span>
        </div>

        <h3 className="text-3xl font-extrabold text-purple-700">{name}</h3>

        <div className="mt-7 space-y-4 text-base font-semibold text-slate-600">
          <p>👩‍🏫 Docente: {docente}</p>
          <p>{turno === "Mañana" ? "☀️" : "☁️"} Turno: {turno}</p>
        </div>
      </div>

      <button className="relative z-10 mt-8 rounded-3xl bg-purple-100 px-5 py-4 text-lg font-extrabold text-purple-700 shadow-md transition hover:bg-purple-200">
        Ver aula →
      </button>
    </div>
  );
}