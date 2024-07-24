import Router from "express"
import * as jobsControl from "./controller/jobs.controller.js"
import validation from "../../middleware/validation.js"
import * as jobvalidation from './jobs.validation.js'
import auth from "../../middleware/auth.js"
import jobsEndpoint from "./jobs.endpoints.js"
import uploadFilecloud, { fileValidation } from '../../utils/multer.js'

const router = Router()

//add job
router.post(
  "/addJob",
  validation(jobvalidation.authSchema, true),
  auth(jobsEndpoint.addJob),
  validation(jobvalidation.addJobschema),
  jobsControl.addJob
)

//update job
.put(
  "/updateJob/:jobId",
  validation(jobvalidation.authSchema, true),
  auth(jobsEndpoint.updateJob),
  validation(jobvalidation.updateJobSchema),
  jobsControl.updateJob
)

//delete job 
.delete(
    "/deleteJob/:jobId",
    validation(jobvalidation.authSchema, true),
    auth(jobsEndpoint.deleteJob),
    validation(jobvalidation.deleteJobSchema),jobsControl.deleteJob)

//allJobsWCompany
.get('/allJobsWCompany',
validation(jobvalidation.authSchema,true),
auth(jobsEndpoint.searchForjobs),
jobsControl.allJobsWCompanyInfo)

//allJobsForCompany
.get('/allJobsForCompany',
validation(jobvalidation.authSchema,true),
auth(jobsEndpoint.allJobsForCompany),
validation(jobvalidation.JobsForCompanySchema),
jobsControl.allJobsForCompany)

//filterJobs
.get('/filterJobs',
validation(jobvalidation.authSchema,true),
auth(jobsEndpoint.filterJobs),
validation(jobvalidation.filterJobsSchema),
jobsControl.filterJobs)

//applyToJob
.post('/applyToJob',
validation(jobvalidation.authSchema,true),
auth(jobsEndpoint.applyToJob),
uploadFilecloud(fileValidation.file).single('file'),
validation(jobvalidation.applyToJobSchema),
jobsControl.applyToJob)



export default router