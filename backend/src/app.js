import express, { urlencoded } from 'express';
import cors from "cors"
import cookieParser from 'cookie-parser'
const app = express();

app.use(cors({
      origin: process.env.CORS_ORIGIN , // allow requests from this origin
      credentials: true , // allow cookies
      optionsSuccessStatus: 200 ,  
}))

app.use(express.static("public"))
app.use(express.json({
     limit:"16kb",
     extended: true,
}))
app.use(express.urlencoded({
     limit:"16kb",
     extended: true,  // allows us to parse JSON and url-encoded data
}))

app.use(cookieParser());

// routes

import userRouter from './routes/user.route.js'

app.use('/api/v1/users',userRouter);

export {app}