"use client";

interface CreateAulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAulaModal({
  isOpen,
  onClose,
}: CreateAulaModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-purple-700">
              Crear aula
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Registra una nueva aula para tu institución.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-purple-100 px-4 py-2 text-xl font-bold text-purple-700 hover:bg-purple-200"
          >
            ×
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Nombre del aula
            </label>
            <input
              type="text"
              placeholder="Ej: Inicial 4 años"
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Docente asignado
            </label>
            <select className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500">
              <option>Docente en espera</option>
              <option>María Pérez</option>
              <option>Carlos López</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Turno
            </label>
            <select className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500">
              <option>Mañana</option>
              <option>Tarde</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">
              Confirma tu contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-slate-100 px-5 py-4 font-extrabold text-slate-600 hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full rounded-2xl bg-purple-600 px-5 py-4 font-extrabold text-white shadow-lg hover:bg-purple-700"
            >
              Crear aula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}