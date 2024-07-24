import express  from "express"
import bootstrap from './src/bootstrap.js'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})

const app = express()
const port = +process.env.PORT


bootstrap(app,express)


app.listen(port,()=>{
    console.log(`app running on port ${port}`);
})