import { vi } from "vitest";

export const prisma = {
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  group: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  groupMember: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  event: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
    delete: vi.fn(),
  },
  attendee: {
    findUnique: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
  groupMessage: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
};

export function resetPrisma() {
  Object.values(prisma).forEach((model) => {
    Object.values(model).forEach((fn) => {
      if (typeof fn === "function" && "mockReset" in fn) {
        (fn as { mockReset: () => void }).mockReset();
      }
    });
  });
}
