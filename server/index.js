import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.route.js'

dotenv.config()

const app = express()

app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false // beacause when we use frontend and backend on different server, it will block the request so we need to set it to false
}))

const PORT = 8080 || process.env.PORT // because some times may be prot 8080 is not available so we can use process.env.PORT

app.get('/', (request, response) => {
    // server to client
    response.json({
        message : 'Server is running '  + PORT
    })    
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use("/api/file", uploadRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

