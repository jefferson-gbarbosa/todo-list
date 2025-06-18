// src/controllers/auth.controller.ts
import { Request, RequestHandler, Response } from "express"
import  prisma  from "../client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { registerSchema } from "../schemas/validation"

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json(parsed.error)
    return
  }

  const { email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(400).json({ message: "Usuário já existe" })
    return
  }

  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hash } })

  res.status(201).json({ message: "Usuário criado", user: { email: user.email, id: user.id } })
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(400).json({ message: "Credenciais inválidas" })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(400).json({ message: "Credenciais inválidas" })
    return
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

  res.json({ user, token})
}

