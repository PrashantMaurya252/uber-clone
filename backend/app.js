import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from './routes/user.routes.js'
import { connectToDb } from "./db/db.js";

const app = express();
connectToDb()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use('/users',userRoutes)

export default app;
