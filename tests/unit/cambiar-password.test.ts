import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { PUT } from "../../src/app/api/cambiar-password/route";
import { prisma } from "../../src/lib/prisma";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    usuario: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("Cambio de contraseña", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debe devolver 400 cuando faltan campos obligatorios", async () => {
    const req = {
      json: async () => ({
        usuarioId: "",
        passwordActual: "",
        nuevaPassword: "",
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(400);
  });

  it("Debe devolver 400 cuando la nueva contraseña no cumple los requisitos", async () => {
    const req = {
      json: async () => ({
        usuarioId: 1,
        passwordActual: "Actual123*",
        nuevaPassword: "12345",
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(400);
  });

  it("Debe devolver 404 cuando el usuario no existe", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue(null);

    const req = {
      json: async () => ({
        usuarioId: 1,
        passwordActual: "Actual123*",
        nuevaPassword: "Nueva123*",
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(404);
  });

  it("Debe devolver 401 cuando la contraseña actual es incorrecta", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue({
      id: 1,
      password: "password-hash",
    });

    (bcrypt.compare as any).mockResolvedValue(false);

    const req = {
      json: async () => ({
        usuarioId: 1,
        passwordActual: "Incorrecta123*",
        nuevaPassword: "Nueva123*",
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(401);
  });

  it("Debe actualizar correctamente una contraseña válida", async () => {
    (prisma.usuario.findUnique as any).mockResolvedValue({
      id: 1,
      password: "password-hash",
    });

    (bcrypt.compare as any).mockResolvedValue(true);
    (bcrypt.hash as any).mockResolvedValue("nueva-password-hash");
    (prisma.usuario.update as any).mockResolvedValue({
      id: 1,
      password: "nueva-password-hash",
    });

    const req = {
      json: async () => ({
        usuarioId: 1,
        passwordActual: "Actual123*",
        nuevaPassword: "Nueva123*",
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(200);

    expect(bcrypt.hash).toHaveBeenCalledWith(
      "Nueva123*",
      10
    );

    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        password: "nueva-password-hash",
      },
    });
  });
});