import joi from 'joi'
import { generalfields } from '../../utils/generalfields.js'

//authSchema
export const authSchema = joi.object({
    auth: joi.string().required()
 }).required()

//addCompanySchema
export const addCompanySchema = joi.object({
    companyName : joi.string().max(15).min(2).required(),
    description : joi.string(),
    address : joi.string(),
    companyEmail:generalfields.email,
    industry : joi.string(),
    numberOfEmployees : joi.object({
        from: joi.number().integer().min(1).required(),
        to: joi.number().integer().min(joi.ref('from')).required() // Ensure 'to' is greater than or equal to 'from'
    })
}).required()

//oneCompanySchema
export const oneCompanySchema = joi.object({
    companyId : generalfields.id
}).required()

//updateCompanySchema
export const updateCompanySchema = joi.object({
    companyName : joi.string().max(15).min(2),
    description : joi.string(),
    address : joi.string(),
    companyEmail: joi.string().email({ tlds: { allow: ['com', 'net'] }}),
    industry : joi.string(),
    numberOfEmployees : joi.object({
        from: joi.number().integer().min(1).required(),
        to: joi.number().integer().min(joi.ref('from')).required() // Ensure 'to' is greater than or equal to 'from'
    }),
    companyId:generalfields.id
}).required()

//deleteCompanySchema
export const deleteCompanySchema = joi.object({
    companyId:generalfields.id
}).required()

//searchForCompanySchema

export const searchForCompanySchema = joi.object({
    companyName : joi.string().required()
  })
  .required();

//allApplicationsSchema
export const allApplicationsSchema = joi.object({
    companyId : generalfields.id
  })
  .required();

  //companyControl.applicationsOnday)
export const applicationsOnday = joi.object({
    companyId : generalfields.id,
    date : joi.string().isoDate().required()
  })
  .required();
