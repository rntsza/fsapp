import { PrismaClient } from "@prisma/client";

let prisma;

if (typeof window === "undefined") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

export default prisma;
