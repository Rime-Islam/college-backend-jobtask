import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";


const app: Application = express();

const corsOptions = {
  origin: [
    "http://localhost:5173"
    // "https://college-frontend-jobtask.vercel.app"
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", route);

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});
// app.use(globalErrorHandler);

export default app;
