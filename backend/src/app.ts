import express from "express"
import cors from "cors";
import router from "./routes";

const app = express()
app.use(express.json())
app.use(cors({
  origin: "http://127.0.0.1:5500", 
  credentials: true
}));

app.use("/api", router);

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
