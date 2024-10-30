import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successful");

    // Verify database schema is ready
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;

    console.log("Available tables:", tables.map((t) => t.tablename).join(", "));
    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Database setup error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error("Setup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
