import jwt from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "../../../generated/prisma/enums";

const register = async (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds
  );

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role as UserRole,
      phone: payload.phone,
      address: payload.address,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      status: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
};

// const login = async (payload: { email: string; password: string }) => {
//   const user = await prisma.user.findUnique({
//     where: { email: payload.email },
//   });

//   if (!user) {
//     throw new AppError(401, "Invalid email or password.");
//   }

//   if (user.status === "BANNED") {
//     throw new AppError(
//       403,
//       "Your account has been banned. Contact admin for support."
//     );
//   }

//   const isPasswordValid = await bcrypt.compare(payload.password, user.password);

//   if (!isPasswordValid) {
//     throw new AppError(401, "Invalid email or password.");
//   }

//   const token = jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     config.jwt.secret,
//     { expiresIn: config.jwt.expiresIn as string }
//   );

//   const { password, ...userWithoutPassword } = user;

//   return { user: userWithoutPassword, token };
// };

// const getMe = async (userId: string) => {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       role: true,
//       phone: true,
//       address: true,
//       avatarUrl: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//       technicianProfile: {
//         include: {
//           services: {
//             include: { category: true },
//           },
//           availability: true,
//         },
//       },
//     },
//   });

//   if (!user) {
//     throw new AppError(404, "User not found.");
//   }

//   return user;
// };

export const AuthService = {
  register,
  // login,
  // getMe,
};