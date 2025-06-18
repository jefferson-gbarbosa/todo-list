import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const taskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional(),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuário inválido")
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});
