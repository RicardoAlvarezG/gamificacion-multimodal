"use client";

import Link from "next/link";
import { useState } from "react";

export default function CambiarContrasenaPage() {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("");

  const validarPassword = (password: string) => {
    return {
      longitud: password.length >= 8 && password.length <= 15,
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /\d/.test(password),
      simbolo: /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password),
    };
  };

  const reglasPassword = validarPassword(nuevaPassword);

  const passwordValida =
    reglasPassword.longitud &&
    reglasPassword.mayuscula &&
    reglasPassword.minuscula &&
    reglasPassword.numero &&
    reglasPassword.simbolo;

  const confirmarValida =
    confirmarPassword.length > 0 && confirmarPassword === nuevaPassword;

  const formularioValido =
    passwordActual.length > 0 && passwordValida && confirmarValida && !loading;

  const mostrarMensaje = (texto: string, tipo: "success" | "error") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    if (!passwordValida) {
      mostrarMensaje("La nueva contraseña no cumple con los requisitos.", "error");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      mostrarMensaje("Las contraseñas no coinciden.", "error");
      return;
    }

    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      mostrarMensaje("No se encontró el usuario en sesión.", "error");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    try {
      setLoading(true);

      const res = await fetch("/api/cambiar-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          passwordActual,
          nuevaPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarMensaje(data.error || "Error al cambiar contraseña.", "error");
        return;
      }

      mostrarMensaje("Contraseña actualizada correctamente.", "success");

      setPasswordActual("");
      setNuevaPassword("");
      setConfirmarPassword("");
    } catch (error) {
      mostrarMensaje("Error de conexión con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 p-6">
      <section className="w-full max-w-2xl rounded-[2rem] bg-white/80 p-10 shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-purple-700">
            Cambiar contraseña 🔒
          </h1>

          <p className="mt-4 text-lg text-slate-700">
            Actualiza tu contraseña de acceso al sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Contraseña actual
            </label>

            <div className="relative mt-2">
              <input
                type={mostrarActual ? "text" : "password"}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                className="w-full rounded-2xl border-2 border-slate-200 px-5 py-3 pr-14 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              />

              <button
                type="button"
                onClick={() => setMostrarActual(!mostrarActual)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-purple-600"
              >
                {mostrarActual ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Nueva contraseña
            </label>

            <div className="relative mt-2">
              <input
                type={mostrarNueva ? "text" : "password"}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className={`w-full rounded-2xl border-2 px-5 py-3 pr-14 outline-none transition focus:ring-4 ${
                  nuevaPassword.length === 0
                    ? "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                    : passwordValida
                    ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                    : "border-red-500 focus:border-red-500 focus:ring-red-100"
                }`}
              />

              <button
                type="button"
                onClick={() => setMostrarNueva(!mostrarNueva)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-purple-600"
              >
                {mostrarNueva ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="mt-3 space-y-1 rounded-2xl bg-slate-50 p-4 text-sm font-semibold">
              <p className={reglasPassword.longitud ? "text-green-600" : "text-red-500"}>
                {reglasPassword.longitud ? "✅" : "❌"} Entre 8 y 15 caracteres
              </p>
              <p className={reglasPassword.mayuscula ? "text-green-600" : "text-red-500"}>
                {reglasPassword.mayuscula ? "✅" : "❌"} Al menos una letra mayúscula
              </p>
              <p className={reglasPassword.minuscula ? "text-green-600" : "text-red-500"}>
                {reglasPassword.minuscula ? "✅" : "❌"} Al menos una letra minúscula
              </p>
              <p className={reglasPassword.numero ? "text-green-600" : "text-red-500"}>
                {reglasPassword.numero ? "✅" : "❌"} Al menos un número
              </p>
              <p className={reglasPassword.simbolo ? "text-green-600" : "text-red-500"}>
                {reglasPassword.simbolo ? "✅" : "❌"} Al menos un símbolo (@, #, $, %, etc.)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Confirmar nueva contraseña
            </label>

            <div className="relative mt-2">
              <input
                type={mostrarConfirmar ? "text" : "password"}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repite tu nueva contraseña"
                className={`w-full rounded-2xl border-2 px-5 py-3 pr-14 outline-none transition focus:ring-4 ${
                  confirmarPassword.length === 0
                    ? "border-slate-200 focus:border-purple-400 focus:ring-purple-100"
                    : confirmarValida
                    ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                    : "border-red-500 focus:border-red-500 focus:ring-red-100"
                }`}
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 hover:text-purple-600"
              >
                {mostrarConfirmar ? "🙈" : "👁️"}
              </button>
            </div>

            {confirmarPassword.length > 0 && (
              <p
                className={`mt-2 text-sm font-semibold ${
                  confirmarValida ? "text-green-600" : "text-red-500"
                }`}
              >
                {confirmarValida
                  ? "✅ Las contraseñas coinciden"
                  : "❌ Las contraseñas no coinciden"}
              </p>
            )}
          </div>

          {mensaje && (
            <div
              className={`rounded-2xl px-5 py-4 text-center font-bold ${
                tipoMensaje === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {mensaje}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!formularioValido}
              className="flex-1 rounded-2xl bg-purple-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

            <Link
              href="/dashboard/administrador"
              className="flex-1 rounded-2xl bg-slate-200 py-4 text-center text-lg font-bold text-slate-700 shadow-lg transition hover:bg-slate-300"
            >
              Regresar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}