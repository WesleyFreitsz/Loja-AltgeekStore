import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import path from "path";
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// No Vercel, o caminho precisa ser absoluto para o SQLite funcionar corretamente
const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const connectionString = process.env.DATABASE_URL || `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

