"use client";

import { useState } from "react";
import Link from "next/link";
import { limpiarUsuario, soloUsuario } from "@/lib/validacionesCampos";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!usuario.trim()) {
  alert("Ingresa tu ID de usuario");
  return;
}

if (!soloUsuario(usuario)) {
  alert("El ID de usuario solo debe contener letras y números");
  return;
}
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    if (data.usuario.rol === "ADMIN") {
      window.location.href = "/dashboard/administrador";
    } else {
      window.location.href = "/dashboard/docente";
    }
  } catch (error) {
    alert("Error de conexión con el servidor");
  } finally {
    setLoading(false);
  }
};
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

      <form onSubmit={handleLogin} className="mt-10 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ID de Usuario
          </label>

          <input
            type="text"
            placeholder="Ejemplo: DOC001"
            value={usuario}
            onChange={(e) => setUsuario(limpiarUsuario(e.target.value))}
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          type="submit"
          className="w-full rounded-2xl bg-purple-600 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div className="mt-8 space-y-4 text-center">
  

  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-slate-200" />
    <span className="text-sm text-slate-400">o</span>
    <div className="h-px flex-1 bg-slate-200" />
  </div>

  <Link
  href="/crear-cuenta"
  className="block w-full rounded-2xl border-2 border-purple-200 bg-purple-50 py-3 font-bold text-purple-700 transition hover:bg-purple-100 text-center"
>
  Crear cuenta nueva
</Link>
</div>
    </div>
  );
}