import express, { Application } from "express";
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

// app.use(notFound);
// app.use(globalErrorHandler);

export default app;
