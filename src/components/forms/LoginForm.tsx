"use client";

import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col justify-center p-8 md:p-10">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-purple-700">
          Iniciar sesión
        </h2>

        <p className="mt-3 text-slate-500">
          Accede con tu ID de docente o Administrador
        </p>
      </div>

      <form className="mt-10 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ID de Usuario
          </label>

          <input
            type="text"
            placeholder="Ejemplo: DOC001"
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Contraseña
          </label>

         <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            className="w-full rounded-2xl border border-slate-200 px-5 py-3 pr-14 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

         <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-purple-600"
          aria-label="Mostrar u ocultar contraseña"
          >
          {showPassword ? "🙈" : "👁️"}
        </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-2xl bg-purple-600 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700"
        >
          Ingresar
        </button>
      </form>

      <div className="mt-8 space-y-4 text-center">
  <button className="text-purple-600 font-semibold hover:underline">
    ¿Olvidaste tu contraseña?
  </button>

  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-slate-200" />
    <span className="text-sm text-slate-400">o</span>
    <div className="h-px flex-1 bg-slate-200" />
  </div>

  <button
    type="button"
    className="w-full rounded-2xl border-2 border-purple-200 bg-purple-50 py-3 font-bold text-purple-700 transition hover:bg-purple-100"
  >
    Crear cuenta nueva
  </button>
</div>
    </div>
  );
}