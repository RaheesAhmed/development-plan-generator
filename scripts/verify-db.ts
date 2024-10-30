import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

async function verifyConnection() {
  const maskedUrl = process.env.DATABASE_URL?.replace(
    /(postgres:\/\/[^:]+:)[^@]+(@.*)/,
    "$1****$2"
  );
  console.log("Attempting to connect with URL:", maskedUrl);

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("Database connection successful!");

    // Check if tables exist and are accessible
    try {
      const [{ count: userCount }] = await prisma.$queryRaw<
        [{ count: string }]
      >`
        SELECT COUNT(*)::text as count FROM "User"
      `;
      console.log(`Users table accessible. ${userCount || "No"} records found`);

      const [{ count: assessmentCount }] = await prisma.$queryRaw<
        [{ count: string }]
      >`
        SELECT COUNT(*)::text as count FROM "Assessment"
      `;
      console.log(
        `Assessments table accessible. ${assessmentCount || "No"} records found`
      );

      return true;
    } catch (queryError) {
      if (queryError instanceof Error) {
        console.error("Table check error:", queryError.message);
      }
      // Return true if we can connect but tables might not be ready
      return true;
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return false;
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}

verifyConnection()
  .then((success) => {
    if (success) {
      console.log("Database verification completed successfully");
      process.exit(0);
    } else {
      console.error("Database verification failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Verification failed with error:", error);
    process.exit(1);
  });
