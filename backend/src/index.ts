import express from "express"
import { userRouter } from "./routes/userRoute.js";
import { blogRouter } from "./routes/blogRoute.js";
import dotenv from 'dotenv'
import cors from 'cors';
import https from 'https'; 
const port = 3000;
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
app.get("/", (req,res)=>{
    res.send("Hello world");
})
app.use("/api/v1",userRouter)
app.use("/api/v1",blogRouter)

const keepAlive = () => {
    https.get('https://blogzone-backend.onrender.com', (res) => {
        console.log(`Keep-alive pinged: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`Error pinging: ${err.message}`);
    });
  };
  setInterval(keepAlive, 10 * 60 * 1000);
app.listen(port,()=>{
    console.log(`listining on port ${port}`);
})