import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";


const app: Application = express();

const corsOptions = {
  origin: [
    "http://localhost:5173"
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

// app.use(globalErrorHandler);

export default app;
