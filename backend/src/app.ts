import dotenv from 'dotenv';
dotenv.config(); 
import express from "express"
import cors from "cors";
import router from "./routes";
import helmet from 'helmet'; 
import { Request, Response, NextFunction } from 'express';

const app = express()
app.use(helmet()); 
app.use(express.json())

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500", 
  credentials: true
}));
app.use("/api", router);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); 
  res.status(500).json({ message: 'Algo deu errado no servidor!' });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
