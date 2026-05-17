"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  role: "administrador" | "docente";
  name: string;
  userId: string;
  institutionName?: string;
}

export default function Header({ role, name, userId, institutionName }: HeaderProps) {
  const [time, setTime] = useState("");

  const institutionalCode = "INST-X4K92A";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(institutionalCode);
    alert("Código institucional copiado");
  };

  return (
    <header className="rounded-[2rem] bg-gradient-to-r from-pink-400 via-yellow-300 to-sky-400 p-1 shadow-lg">
      <div className="rounded-[1.8rem] bg-white/90 p-5 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        
        {/* lado izquierdo */}
        <div>
          <p className="text-sm font-bold text-purple-600">
            Panel principal
          </p>

          <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-800">
          {name}
          </h1>

          {role === "docente" && institutionName && (
          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700">
           🏫 {institutionName}
          </span>
          )}
          </div>

          <p className="mt-1 text-slate-500 font-medium">
            ID de usuario: <span className="font-bold">{userId}</span>
          </p>
        </div>

        {/* lado derecho */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="rounded-2xl bg-sky-100 px-4 py-3 text-sky-700 font-extrabold shadow-sm">
            🕒 {time}
          </div>

          <div className="rounded-2xl bg-yellow-100 px-4 py-3 text-yellow-700 font-extrabold shadow-sm">
            🛡️ {role === "administrador" ? "Administrador" : "Docente"}
          </div>

        {role === "administrador" && (
          <div className="rounded-2xl bg-purple-100 px-4 py-3 shadow-sm">
            <p className="text-xs font-bold text-purple-500">
              Código institucional
            </p>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-purple-800">
                {institutionalCode}
              </span>

              <button
                onClick={copyCode}
                className="rounded-xl bg-purple-600 px-3 py-2 text-sm font-bold text-white hover:bg-purple-700 transition"
              >
                Copiar
              </button>
            </div>
          </div>
        )}  
        </div>
      </div>
    </header>
  );
}