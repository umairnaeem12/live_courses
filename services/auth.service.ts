// services/auth.service.ts
import { AppDataSource } from "../data-source";
import { UserRepository, InstructorRepository } from "../repositories";
import { UserRole } from "../enums/UserRole.enum";
import Instructor from "../models/Instructor";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RegisterInput, LoginInput } from "../validators/auth.validation";

function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export async function registerService(input: RegisterInput & { displayName?: string }) {
  const existing = await UserRepository.findOne({ where: { email: input.email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 10);

  const result = await AppDataSource.transaction(async (trx) => {
    const userRepo = trx.getRepository(User);
    const instructorRepo = trx.getRepository(Instructor);

    const user = userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role, // may be STUDENT or INSTRUCTOR
    });
    await userRepo.save(user);

    // If registering as instructor, create the Instructor profile too
    if (input.role === UserRole.INSTRUCTOR) {
      const instructor = instructorRepo.create({
        user,
        displayName: input.displayName ?? user.name,
      });
      await instructorRepo.save(instructor);
    }

    // strip passwordHash before returning
    const { passwordHash: _, ...safe } = user as User & { passwordHash?: string };
    return { user: safe };
  });

  return result;
}

export async function loginService(input: LoginInput) {
  const user = await UserRepository
    .createQueryBuilder("u")
    .addSelect("u.passwordHash")
    .where("u.email = :email", { email: input.email })
    .getOne();

  if (!user) throw new Error("Invalid email or password");
  if (user.role !== input.role) throw new Error("Invalid role for this account");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  const token = signJwt({ userId: user.id, role: user.role });
  const { passwordHash: _, ...safe } = user as User & { passwordHash?: string };
  return { user: safe, token };
}

export * as AuthService from "./auth.service";