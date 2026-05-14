export default function LoginForm() {
  return (
    <div className="flex flex-col justify-center p-10 md:p-14">
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-bold text-purple-700">
          Iniciar sesión
        </h2>

        <p className="mt-3 text-slate-500">
          Accede con tu cuenta de docente o administrador
        </p>
      </div>

      <form className="mt-10 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="usuario@colegio.edu.pe"
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Contraseña
          </label>

          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />
        </div>

        <button
          type="button"
          className="w-full rounded-2xl bg-purple-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700"
        >
          Ingresar
        </button>
      </form>

      <div className="mt-8 text-center">
        <button className="text-purple-600 font-semibold hover:underline">
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}