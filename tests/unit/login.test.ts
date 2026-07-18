import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { POST } from "../../src/app/api/login/route";
import { prisma } from "../../src/lib/prisma";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

describe("Inicio de sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debe devolver 400 cuando faltan usuario o contraseña", async () => {
    const req = {
      json: async () => ({
        usuario: "",
        password: "",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("Debe devolver 401 cuando el usuario no existe", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue(null);

    const req = {
      json: async () => ({
        usuario: "admin",
        password: "123456",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("Debe devolver 401 cuando la contraseña es incorrecta", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue({
      password: "hash",
      estado: "activo",
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    const req = {
      json: async () => ({
        usuario: "admin",
        password: "123456",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("Debe devolver 403 cuando la cuenta no está activa", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue({
      password: "hash",
      estado: "pendiente",
    });

    (bcrypt.compare as any).mockResolvedValue(true);

    const req = {
      json: async () => ({
        usuario: "admin",
        password: "123456",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(403);
  });

  it("Debe devolver 200 cuando el inicio de sesión es correcto", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue({
      id: 1,
      nombre: "Administrador",
      usuario: "admin",
      password: "hash",
      estado: "activo",
      rol: "ADMIN",
      codigoInstitucional: "INST-001",
      institucionId: 1,
    });

    (bcrypt.compare as any).mockResolvedValue(true);

    const req = {
      json: async () => ({
        usuario: "admin",
        password: "123456",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(200);
  });
});