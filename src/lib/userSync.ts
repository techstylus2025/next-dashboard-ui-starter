import { Prisma } from "@prisma/client";
import prisma from "./prisma";

function isUsernameUniqueConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const prismaError = error as {
    code?: string;
    message?: string;
    meta?: { target?: unknown };
  };
  if (prismaError.code !== "P2002") {
    return false;
  }

  const target = prismaError.meta?.target;
  if (Array.isArray(target) && target.includes("username")) {
    return true;
  }
  if (typeof target === "string" && target.includes("username")) {
    return true;
  }

  return /unique constraint failed on the fields:?\s*\([^)]*username/i.test(
    prismaError.message ?? ""
  );
}

export async function upsertCanonicalUser(args: Prisma.UserUpsertArgs) {
  try {
    return await prisma.user.upsert(args);
  } catch (error) {
    const userId = args.where.id;
    if (!userId || !isUsernameUniqueConflict(error)) {
      throw error;
    }

    console.warn("Canonical username is already in use; using the user ID instead.", {
      userId,
    });

    return prisma.user.upsert({
      ...args,
      update: { ...args.update, username: userId },
      create: { ...args.create, username: userId },
    });
  }
}
