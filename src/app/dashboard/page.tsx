import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl">🏫</div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">Aulas</h2>
          <p className="mt-2 text-slate-500">Gestiona las aulas registradas.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl">🧒</div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">Estudiantes</h2>
          <p className="mt-2 text-slate-500">Administra estudiantes y perfiles.</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-4xl">🏆</div>
          <h2 className="mt-4 text-xl font-bold text-slate-800">Gamificación</h2>
          <p className="mt-2 text-slate-500">Controla puntos, reglas y progreso.</p>
        </div>
      </section>
    </DashboardLayout>
  );
}