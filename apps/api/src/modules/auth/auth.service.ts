import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/client.js";
import { env } from "../../config/env.js";
import { UnauthorizedError, ConflictError, NotFoundError } from "../../domain/errors.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

const SALT_ROUNDS = 12;

export interface AuthTokenPayload {
  staffId: string;
  role: "SERVER" | "KITCHEN" | "MANAGER";
}

export async function login(input: LoginInput) {
  const staff = await prisma.staff.findUnique({ where: { email: input.email } });
  if (!staff) {
    throw new UnauthorizedError();
  }

  const passwordMatches = await bcrypt.compare(input.password, staff.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError();
  }

  const token = signToken({ staffId: staff.id, role: staff.role });
  return { token, staff: toPublicStaff(staff) };
}

export async function registerStaff(input: RegisterInput) {
  const existing = await prisma.staff.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("A staff member with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const staff = await prisma.staff.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role,
    },
  });

  return toPublicStaff(staff);
}

export async function getStaffById(staffId: string) {
  const staff = await prisma.staff.findUnique({ where: { id: staffId } });
  if (!staff) {
    throw new NotFoundError("Staff member");
  }
  return toPublicStaff(staff);
}

export function signToken(payload: AuthTokenPayload): string {
  const options = { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions;
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}

function toPublicStaff(staff: { id: string; fullName: string; email: string; role: string }) {
  return {
    id: staff.id,
    fullName: staff.fullName,
    email: staff.email,
    role: staff.role,
  };
}
