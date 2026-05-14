export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-200 via-pink-200 to-yellow-100 flex items-center justify-center p-6">
      <section className="max-w-3xl bg-white rounded-3xl shadow-2xl p-10 text-center border-4 border-white">
        <div className="text-6xl mb-4">🎮🌈⭐</div>

        <h1 className="text-4xl md:text-5xl font-bold text-purple-700">
          Aula Gamificada
        </h1>

        <p className="mt-6 text-lg text-slate-700 leading-relaxed">
          Plataforma web interactiva para fomentar el comportamiento positivo,
          la participación y el aprendizaje mediante actividades multimodales y gamificación.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <div className="bg-sky-400 text-white px-5 py-3 rounded-2xl shadow-md">
            🧑‍🏫 Docentes
          </div>

          <div className="bg-pink-400 text-white px-5 py-3 rounded-2xl shadow-md">
            🧒 Estudiantes
          </div>

          <div className="bg-yellow-400 text-white px-5 py-3 rounded-2xl shadow-md">
            🏆 Gamificación
          </div>
        </div>
      </section>
    </main>
  );
}