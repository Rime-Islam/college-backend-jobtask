import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";


const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", route);

app.get("/", (_req, res) => {
  res.send("Server is running 🚀");
});

app.use(globalErrorHandler);

export default app;
