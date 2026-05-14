import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentCard from "@/components/cards/StudentCard";
import { estudiantesMock } from "@/modules/estudiantes/data";

export default function EstudiantesPage() {
  return (
    <DashboardLayout>
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Gestión de estudiantes
            </h2>
            <p className="mt-2 text-slate-500">
              Visualiza los estudiantes registrados y su progreso gamificado.
            </p>
          </div>

          <button className="rounded-2xl bg-purple-600 px-5 py-3 font-bold text-white shadow-md hover:bg-purple-700">
            + Registrar estudiante
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {estudiantesMock.map((estudiante) => (
            <StudentCard key={estudiante.id} {...estudiante} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}