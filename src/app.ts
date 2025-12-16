import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import route from "./route";


const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", route);

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status_code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally shut down the server gracefully
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally shut down the server gracefully
});

export default app;
