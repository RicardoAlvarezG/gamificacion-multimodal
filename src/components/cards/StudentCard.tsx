type StudentCardProps = {
  nombres: string;
  apellidos: string;
  aula: string;
  avatar: string;
  puntos: number;
  nivel: number;
};

export default function StudentCard({
  nombres,
  apellidos,
  aula,
  avatar,
  puntos,
  nivel,
}: StudentCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-4xl">
          {avatar}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {nombres} {apellidos}
          </h3>
          <p className="text-sm text-slate-500">{aula}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-yellow-100 p-4 text-center">
          <p className="text-sm font-semibold text-yellow-700">Puntos</p>
          <p className="text-2xl font-bold text-yellow-600">{puntos}</p>
        </div>

        <div className="rounded-2xl bg-sky-100 p-4 text-center">
          <p className="text-sm font-semibold text-sky-700">Nivel</p>
          <p className="text-2xl font-bold text-sky-600">{nivel}</p>
        </div>
      </div>
    </article>
  );
}