import joi from 'joi'
import { generalfields } from '../../utils/generalfields.js'

//addJobschema
export const addJobschema = joi.object({
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    jobLocation: joi.string().valid("Remotly", "Onsite", "hybrid").required(),
    jobTitle: joi.string().min(2).max(30).required(),
    companyId: generalfields.id,
    softSkills: joi.array().items(joi.string()),
    technicalSkills : joi.array().items(joi.string()),
  })
    .required();

    //updateJobSchema
export const updateJobSchema = joi
  .object({
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    workingTime: joi.string().valid("part-time", "full-time"),
    jobLocation: joi.string().valid("Remotly", "Onsite", "hybrid"),
    jobTitle: joi.string().min(2).max(30),
    companyId: generalfields.id,
    jobId:generalfields.id,
    softSkills: joi.array().items(joi.string()),
    technicalSkills : joi.array().items(joi.string()),

  })
  .required();

//deleteJobSchema
export const deleteJobSchema = joi.object({
    jobId : generalfields.id,
    companyId:generalfields.id
}).required()

//applyToJobSchema
export const applyToJobSchema = joi.object({
    jobId : generalfields.id,
    userSoftSkills: joi.array().items(joi.string()),
    userTechSkills : joi.array().items(joi.string()),
    file: generalfields.file,
    companyId:generalfields.id
}).required()

 //JobsForCompanySchema
 export const JobsForCompanySchema = joi.object({
    companyName: joi.string().required()
 }).required()

 //filterJobsSchema
 export const filterJobsSchema = joi.object({
    seniorityLevel: joi
    .string()
    .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
  workingTime: joi.string().valid("part-time", "full-time"),
  jobLocation: joi.string().valid("Remotly", "Onsite", "hybrid"),
  jobTitle: joi.string().min(2).max(30),
  technicalSkills : joi.array().items(joi.string()),
  softSkills: joi.array().items(joi.string())
 }).min(1).required()
 //authSchema
export const authSchema = joi.object({
    auth: joi.string().required()
 }).required()


