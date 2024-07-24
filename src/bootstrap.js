import connection from '../DB/connection.js'
import userRouter from './modules/user/user.router.js'
import CompanyRouter from './modules/company/company.router.js'
import jobsRouter from './modules/jobs/jobs.router.js'
import { globalError } from './utils/asynchandler.js'

const bootstrap = (app,express)=>{
app.use(express.json({}))
//setup API routing
app.use('/user',userRouter)
app.use('/Company',CompanyRouter)
app.use('/jobs',jobsRouter)

app.all('*',(req,res,next)=>{
res.send("in_valid routing please check url or method")
})
app.use(globalError)
connection()
}

export default bootstrap