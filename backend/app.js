import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from './routes/user.routes.js'
import captainRoutes from './routes/captain.routes.js'
import { connectToDb } from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();
connectToDb()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use('/users',userRoutes)
app.use('/captain',captainRoutes)

export default app;
