import express, { Request, Response, NextFunction } from "express"
import { userRouter } from "./routes/userRoute.js";
import dotenv from 'dotenv'
import cors from 'cors';
import { aiRouter } from "./routes/aiRoute.js";
import router from "./routes/blogRoute.js";
const port = 8000;
const app = express();
dotenv.config()
const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, if your application uses them
    optionsSuccessStatus: 204,
    // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", userRouter)
app.use("/api/v1", router)
app.use("/api/v1", aiRouter)
app.get('/health', (_, res) => {
    res.status(200).send('OK');
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`listining on port ${port}`);
})