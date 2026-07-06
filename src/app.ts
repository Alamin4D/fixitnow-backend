import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { AuthRoutes } from "./modules/auth/auth.route";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))


// app.use("/api/subscription/webhook", express.raw({type: 'application/json'}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World")
})

app.use("/api/auth", AuthRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/premium", premiumRoutes);


// app.use(notFound)

// app.use(globalErrorHandler)

export default app;