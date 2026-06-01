import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// ============================================================
// Global Prisma Client Instance
// ============================================================
// Dalam Next.js development mode, hot-reload menyebabkan file
// di-import ulang berkali-kali. Tanpa pola singleton ini, setiap
// reload akan membuat koneksi database baru dan akhirnya
// menghabiskan connection pool ("too many connections" error).
//
// Pada production, instance langsung dibuat karena tidak ada
// hot-reload.
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Setup the database adapter connection
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
