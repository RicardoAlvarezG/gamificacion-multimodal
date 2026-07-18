import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DELETE,
  POST,
  PUT,
} from "../../src/app/api/estudiantes/route";
import { prisma } from "../../src/lib/prisma";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    estudiante: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    puntaje: {
      deleteMany: vi.fn(),
    },
    perfilGamificado: {
      deleteMany: vi.fn(),
    },
  },
}));

describe("Gestión de estudiantes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debe devolver 400 cuando faltan datos obligatorios", async () => {
    const req = {
      json: async () => ({
        nombres: "",
        apellidos: "",
        aulaId: "",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("Debe crear correctamente un estudiante", async () => {
    (prisma.estudiante.create as any).mockResolvedValue({
      id: 1,
      nombres: "Carlos",
      apellidos: "Pérez",
      aulaId: 2,
      perfil: {
        nivel: 1,
        puntosTotal: 0,
      },
    });

    const req = {
      json: async () => ({
        nombres: "Carlos",
        apellidos: "Pérez",
        aulaId: 2,
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.estudiante.create).toHaveBeenCalled();
  });

  it("Debe crear el perfil gamificado con nivel 1 y 0 puntos", async () => {
    (prisma.estudiante.create as any).mockResolvedValue({
      id: 1,
      nombres: "Carlos",
      apellidos: "Pérez",
      aulaId: 2,
      perfil: {
        nivel: 1,
        puntosTotal: 0,
      },
    });

    const req = {
      json: async () => ({
        nombres: "Carlos",
        apellidos: "Pérez",
        aulaId: 2,
      }),
    } as Request;

    await POST(req);

    expect(prisma.estudiante.create).toHaveBeenCalledWith({
      data: {
        nombres: "Carlos",
        apellidos: "Pérez",
        aulaId: 2,
        perfil: {
          create: {
            nivel: 1,
            puntosTotal: 0,
          },
        },
      },
      include: {
        perfil: true,
      },
    });
  });

  it("Debe devolver 400 al editar con datos incompletos", async () => {
    const req = {
      json: async () => ({
        estudianteId: 1,
        nombres: "",
        apellidos: "Pérez",
        aulaId: 2,
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(400);
  });

  it("Debe eliminar correctamente al estudiante y sus datos asociados", async () => {
    (prisma.puntaje.deleteMany as any).mockResolvedValue({
      count: 2,
    });

    (prisma.perfilGamificado.deleteMany as any).mockResolvedValue({
      count: 1,
    });

    (prisma.estudiante.delete as any).mockResolvedValue({
      id: 1,
    });

    const req = {
      json: async () => ({
        estudianteId: 1,
      }),
    } as Request;

    const res = await DELETE(req);

    expect(res.status).toBe(200);

    expect(prisma.puntaje.deleteMany).toHaveBeenCalledWith({
      where: {
        estudianteId: 1,
      },
    });

    expect(
      prisma.perfilGamificado.deleteMany
    ).toHaveBeenCalledWith({
      where: {
        estudianteId: 1,
      },
    });

    expect(prisma.estudiante.delete).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
    });
  });
});