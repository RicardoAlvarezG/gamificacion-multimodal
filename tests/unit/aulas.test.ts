import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  POST,
  PUT,
} from "../../src/app/api/aulas/route";
import { prisma } from "../../src/lib/prisma";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    aula: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Gestión de aulas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Debe devolver 400 cuando faltan nombre o turno", async () => {
    const req = {
      json: async () => ({
        nombre: "",
        turno: "",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("Debe crear correctamente un aula", async () => {
    (prisma.aula.create as any).mockResolvedValue({
      id: 1,
      nombre: "Aula de 4 años",
      turno: "Mañana",
      grado: "4 años",
    });

    const req = {
      json: async () => ({
        nombre: "Aula de 4 años",
        turno: "Mañana",
        grado: "4 años",
      }),
    } as Request;

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.aula.create).toHaveBeenCalled();
  });

  it("Debe crear un aula asociada a una institución", async () => {
    (prisma.aula.create as any).mockResolvedValue({
      id: 1,
      nombre: "Aula de 4 años",
      turno: "Mañana",
      grado: "4 años",
      institucionId: 2,
    });

    const req = {
      json: async () => ({
        nombre: "Aula de 4 años",
        turno: "Mañana",
        grado: "4 años",
        institucionId: 2,
      }),
    } as Request;

    await POST(req);

    expect(prisma.aula.create).toHaveBeenCalledWith({
      data: {
        nombre: "Aula de 4 años",
        turno: "Mañana",
        grado: "4 años",
        institucion: {
          connect: {
            id: 2,
          },
        },
      },
    });
  });

  it("Debe crear un aula con docente asignado", async () => {
    (prisma.aula.create as any).mockResolvedValue({
      id: 1,
      nombre: "Aula de 5 años",
      turno: "Tarde",
      grado: "5 años",
      docenteId: 3,
    });

    const req = {
      json: async () => ({
        nombre: "Aula de 5 años",
        turno: "Tarde",
        grado: "5 años",
        docenteId: 3,
      }),
    } as Request;

    await POST(req);

    expect(prisma.aula.create).toHaveBeenCalledWith({
      data: {
        nombre: "Aula de 5 años",
        turno: "Tarde",
        grado: "5 años",
        docente: {
          connect: {
            id: 3,
          },
        },
      },
    });
  });

  it("Debe actualizar correctamente el docente asignado al aula", async () => {
    (prisma.aula.update as any).mockResolvedValue({
      id: 1,
      nombre: "Aula de 5 años",
      docenteId: 4,
    });

    const req = {
      json: async () => ({
        aulaId: 1,
        docenteId: 4,
      }),
    } as Request;

    const res = await PUT(req);

    expect(res.status).toBe(200);

    expect(prisma.aula.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        docenteId: 4,
      },
      include: {
        docente: true,
        institucion: true,
        estudiantes: true,
      },
    });
  });
});