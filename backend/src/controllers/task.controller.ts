import { Request, Response } from 'express';
import  prisma  from "../client"
import { taskSchema,  updateTaskSchema } from "../schemas/validation"; 
import { ObjectId } from 'mongodb';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success){
    res.status(400).json(parsed.error);
    return
  }
  try {
    const task = await prisma.task.create({ data: parsed.data });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa", details: err });
  }
};


export const listTasks = async (req: Request, res: Response): Promise<void> =>{
  const { userId, completed, sortBy } = req.query;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "Parâmetro 'userId' é obrigatório e deve ser uma string." });
    return
  }

  const filter: any = {
    userId: new ObjectId(userId),
  };

  if (completed !== undefined) {
    filter.completed = completed === "true";
  }

  const orderBy =
  sortBy === "createdAt"
    ? { createdAt: "desc" as const } 
    : undefined;

  try {
    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas", details: err });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> =>{
  const { id } = req.params;
  const { title, completed } = req.body;

  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { title, completed },
    });
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: "Tarefa não encontrada ou erro ao atualizar", details: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
   const { id } = req.params;

    try {
        await prisma.task.delete({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(404).json({ error: "Tarefa não encontrada ou ID inválido" });
    }
};
