"use server";

import prisma from "@/lib/prisma";
import { signupSchema } from "@/lib/schemas";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcryptjs";

const actionClient = createSafeActionClient();

export const signup = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput: { email, password, firstName, lastName } }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
    },
  });

  return { success: true, userId: user.id };
});
