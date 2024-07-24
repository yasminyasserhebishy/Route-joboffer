import cloudinary from '../../../utils/cloudinary.js'
import jobModel from "../../../../DB/model/Job.model.js";
import { asyncHandler } from "../../../utils/asynchandler.js";
import companyModel from '../../../../DB/model/Company.model.js';
import applicationModel from '../../../../DB/model/Application.model.js';

// Add Job 
export const addJob = asyncHandler(
  async (req, res, next) => {
    //check company exist 
    const id_exist = await companyModel.findById({_id : req.body.companyId})
    if (! id_exist) {
        return next(new Error('company not found',{cause: 404}))
    }
    //check you are the owner of company
    if(!id_exist.companyHR.equals(req.user._id)){
        return next(new Error("you can't add this job",{cause:400}))
    }
   req.body.addedBy = req.user._id
   const job = await jobModel.create(req.body)
   res.status(201).json({message:"job created successfully",job})
    }
)

// Update Job
export const updateJob = asyncHandler(async (req, res, next) => {
  //get data from req
  const { jobId } = req.params
  //check if company exist
    const id_exist = await companyModel.findById({_id : req.body.companyId})
    if (! id_exist) {
        return next(new Error('company not found',{cause: 404}))
    }
  //check if job exist
    const jobExist = await jobModel.findById({_id : jobId})
    if (! jobExist) {
        return next(new Error('job not found',{cause: 404}))
    }
  //check if you are the owner of job
    if(!jobExist.addedBy.equals(req.user._id)){
        return next(new Error("you can't update this job",{cause:400}))
    }
  //update job
    const updated = await jobModel.findOneAndUpdate({_id : jobId},req.body,{new : true})
    return res.status(200).json({message:"updated sucessfully",updated}) 
    })

    //Get all Jobs with their company’s information.
export const allJobsWCompanyInfo =asyncHandler(async(req,res,next)=>{
  let jobs;
  //if companyHR
  if (req.user.role === 'Company_HR') {
    jobs = await jobModel.find().populate({
        path : 'companyId',
    })
    //if user
  } else if (req.user.role === 'User') {
    jobs = await jobModel.find().populate({
      path: 'companyId' ,
      select: '-isDeleted -createdAt -updatedAt', //Exclude unnecessary fields
    });
  }
  //if no jobs
  if(jobs.length == 0){
    return next(new Error('no jobs found',{cause: 404}))
  }
  //retreive jobs with company
res.status(200).json({message:"done",jobs})
})

//Delete Job
export const deleteJob =asyncHandler(async(req,res,next)=>{
  //get data from req
    const {jobId} = req.params
    //check company exist
    const id_exist = await companyModel.findById({_id : req.body.companyId})
    if (! id_exist) {
        return next(new Error('company not found',{cause: 404}))
    }
    //check job exist 
    const jobExist = await jobModel.findById({_id : jobId})
    if (! jobExist) {
        return next(new Error('job not found',{cause: 404}))
    }
    //check if you have access
    if(!jobExist.addedBy.equals(req.user._id)){
        return next(new Error("you can't delete this job",{cause:400}))
    }
    //delete job 
    const deleteJob = await jobModel.findByIdAndDelete({_id : jobId})
    return res.status(200).json({message:"deleted sucessfully"}) 
})

//Get all Jobs for a specific company.
export const allJobsForCompany =asyncHandler(async(req,res,next)=>{
    const {companyName} = req.query
    //check if company exist
    const company = await companyModel.findOne({ companyName });
    if (!company) {
      return next(new Error('company not found',{cause: 404}))
    }
    // check jobs for specific company
    const jobs = await jobModel.find({ companyId: company._id }).populate({ path:"companyId"})
    if(jobs.length == 0){
      return next(new Error('no jobs found',{cause: 404}))
    }
    //  retrieve jobs
   return res.status(200).json({ message: 'Success', jobs });
  })

// Get all Jobs that match the following filters 
export const filterJobs =asyncHandler(async(req,res,next)=>{
  //get data from req
const filter = req.query;
const query = {};
//check 
    if (filter.workingTime) {
        query.workingTime = filter.workingTime;
    }
    if (filter.jobLocation) {
        query.jobLocation = filter.jobLocation;
    }
    if (filter.seniorityLevel) {
        query.seniorityLevel = filter.seniorityLevel;
    }
    if (filter.jobTitle) {
        query.jobTitle = filter.jobTitle;
    }
    if (filter.technicalSkills) {
      query.technicalSkills = { $all: filter.technicalSkills };
    }
    //find filtered jobs
     const jobs = await jobModel.find(query);
     //check length
     if(jobs.length == 0){
      return next(new Error('no jobs match',{cause: 404}))
     }
     return res.status(200).json({ message:  'jobs Filtered successfully', jobs }); 
})

//Apply to Job
export const applyToJob = asyncHandler(async(req,res,next)=>{
  //get data from req
  const{jobId,companyId} = req.body
    //check job exist 
    const companyExist = await companyModel.findById({_id : companyId})
    if (! companyExist) {
        return next(new Error('company not found',{cause: 404}))
    }
    const jobExist = await jobModel.findById({_id : jobId})
    if (! jobExist) {
        return next(new Error('job not found',{cause: 404}))
    }
//check if company added this job 
if (jobExist.companyId != companyId) {
  return next(new Error("this job doesn't exist in this company ", { cause: 400 }));
}
  //check if user applied before
    const existingApplication = await applicationModel.findOne({
      
        jobId,
        userId: req.user._id
      })
      if (existingApplication) {
        return next(new Error('User already applied to this job'),{cause:409});
      }
      //upload cv 
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_NAME}/${jobId}/CV/${req.user._id}`
      });
      if(!public_id){
        return next(new Error('pdf not uploaded',{cause: 400}))
    }
    //add userResume
    req.body.userResume = {public_id,secure_url} 
    //add userId
    req.body.userId = req.user._id
   const applyingtojob = await applicationModel.create(req.body);

  // add application 
  res.status(200).json({ message: 'Application submitted successfully', applyingtojob });
})
