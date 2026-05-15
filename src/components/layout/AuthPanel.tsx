export default function AuthPanel() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 p-12 text-white">
      <div className="text-8xl mb-6">🎮</div>

      <h1 className="text-4xl font-bold text-center">
        Aula Gamificada
      </h1>

      <p className="mt-6 text-center text-lg leading-relaxed text-white/95">
        Plataforma interactiva para promover el comportamiento positivo,
        participación activa y aprendizaje mediante gamificación.
      </p>

      <div className="mt-8 flex gap-4 text-4xl">
        <span>🌈</span>
        <span>⭐</span>
        <span>🏆</span>
        <span>🧩</span>
      </div>
    </div>
  );
}