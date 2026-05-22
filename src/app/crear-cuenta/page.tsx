"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export default function CrearCuentaPage() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        institucion: "",
        usuario: "",
        password: "",
        confirmarPassword: "",
        codigoInstitucional: "",
      });

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (formData.password !== formData.confirmarPassword) {
            alert("Las contraseñas no coinciden");
            return;
          }

          try {
            const res = await fetch("/api/registro", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  ...formData,
                  rol: rolSeleccionado === "administrador" ? "ADMIN" : "DOCENTE",
            }),
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.error || "Error al registrar");
              return;
            }

            alert("Cuenta creada correctamente");

            setFormData({
              nombre: "",
              correo: "",
              institucion: "",
              usuario: "",
              password: "",
              confirmarPassword: "",
              codigoInstitucional: "",
            });

          } catch (error) {
            alert("Error de conexión con el servidor");
          }
        };


  const inputClass =
    "w-full mt-1 px-5 py-3 bg-white border-2 border-blue-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-400 transition";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-300 to-yellow-200 px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border-4 border-white">

        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎮</div>
          <h1 className="text-3xl font-bold text-blue-700">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 mt-2">
            Únete a la aventura educativa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Nombres y apellidos
            </label>
            <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={inputClass}
                />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Correo electrónico
            </label>
            <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                className={inputClass}
              />
          </div>

        <div>
            <label className="block text-sm font-semibold text-blue-700">
            {rolSeleccionado === "administrador"
            ? "Institución *"
            : "Institución (opcional)"}
            </label>

            <input
                type="text"
                placeholder={
                rolSeleccionado === "administrador"
                ? "Nombre de la institución"
                : "Si aplica, nombre de institución"
                }
                className={inputClass}
             />
        </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700">
              ID de usuario
            </label>
            <input
                type="text"
                name="usuario"
                placeholder="ID de usuario"
                value={formData.usuario}
                onChange={handleChange}
                className={inputClass}
              />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-3">
              Selecciona tu rol
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRolSeleccionado("docente")}
                className={`p-5 rounded-2xl border-2 transition transform hover:scale-105 ${
                  rolSeleccionado === "docente"
                    ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                <GraduationCap size={36} className="mx-auto mb-2" />
                <p className="font-bold">Docente</p>
              </button>

              <button
                type="button"
                onClick={() => setRolSeleccionado("administrador")}
                className={`p-5 rounded-2xl border-2 transition transform hover:scale-105 ${
                  rolSeleccionado === "administrador"
                    ? "bg-yellow-400 text-white border-yellow-500 shadow-lg"
                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
                }`}
              >
                <ShieldCheck size={36} className="mx-auto mb-2" />
                <p className="font-bold">Administrador</p>
              </button>
            </div>
          </div>

          {rolSeleccionado === "docente" && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <label className="block text-sm font-semibold text-blue-700">
                Código institucional (opcional)
              </label>

              <div className="relative mt-2">
                <KeyRound
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="text"
                  placeholder="Ingresa el código del administrador"
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-blue-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <p className="text-xs text-gray-600 mt-2">
                Si tienes un código institucional, quedarás vinculado al panel
                del administrador y pendiente de aprobación.
              </p>
            </div>
          )}

          {rolSeleccionado === "administrador" && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <p className="text-sm text-yellow-700 font-medium">
                Al crear tu cuenta como administrador, el sistema generará un
                código único institucional para registrar docentes.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Contraseña
            </label>
            <div className="relative mt-1">
             <input
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {mostrarPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-700">
              Confirmar contraseña
            </label>
            <div className="relative mt-1">
              <input
                  type={mostrarConfirmar ? "text" : "password"}
                  name="confirmarPassword"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className={inputClass}
                />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {mostrarConfirmar ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-[1.02]"
          >
            Crear cuenta 🚀
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-700 font-bold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>
    </main>
  );
}