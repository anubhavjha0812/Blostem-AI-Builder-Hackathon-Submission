import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // @ts-ignore - Explicit datasourceUrl is required by Prisma v7 when omitted from schema
    datasourceUrl: process.env.DATABASE_URL, // ✅ NEW (Prisma v7 requirement)
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}