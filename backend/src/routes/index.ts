import { Router } from "express";
import { createTask, deleteTask, listTasks, updateTask,} from "../controllers/task.controller";
import { login, register } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-up", register)
router.post("/sign-in", login)
router.post("/create-tasks", createTask);
router.get("/tasks", listTasks);
router.put("/tasks/:id", authenticate, updateTask);
router.delete("/tasks/:id",authenticate, deleteTask);

export default router;
