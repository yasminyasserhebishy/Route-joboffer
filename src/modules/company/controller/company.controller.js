import slugify from "slugify"
import companyModel from "../../../../DB/model/Company.model.js"
import jobModel from "../../../../DB/model/Job.model.js"
import {asyncHandler} from "../../../utils/asynchandler.js"
import applicationModel from "../../../../DB/model/Application.model.js"
import ExcelJS from 'exceljs'
import { fileURLToPath } from 'url';
import { dirname, join} from 'path';

// 1. Add company 
export const addCompany = asyncHandler(async (req, res, next) => {
    //get data from req
    const { companyName, companyEmail } = req.body
    //check email exist
    if(await companyModel.findOne({companyEmail})){
        return next(new Error('email already exist'),{cause:409})
    }
    //check name unique
    if(await companyModel.findOne({companyName})){
        return next(new Error('companyName must be unique'),{cause:409})
    }
    //add companyHR id 
    req.body.companyHR = req.user._id;
    //create company
    const company = await companyModel.create(req.body)
    return res.status(201).json({message:"done",company})
})

// 2. Get company data 
export const getCompanyData = asyncHandler(async (req, res, next) => {
    //get data from req
    const { companyId } = req.params
    //check if company exist
const oneCompany = await companyModel.findById({_id : companyId}).populate({
    path : 'Job'
})
if (! oneCompany){
    return next(new Error('company not found'),{cause:404})
}
    //get company
return res.status(200).json({message:"done",oneCompany}) 

})

 // 3. Update company data
export const updateCompanyData = asyncHandler(async (req, res, next) => {
    //get data from req
    const { companyId } = req.params
    //if no data to update 
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new Error("no data to be updated", { cause: 400 }));
    }
    //check company exist
    const id_exist = await companyModel.findById({_id : companyId})
    if (! id_exist) {
        return next(new Error('company not found',{cause: 404}))
    }
    //check if you are owner or not 
        if (!id_exist.companyHR.equals(req.user._id)) {
          return next(
            new Error("you are not the owner of company", { cause: 400 })
          );
        }
    //if update companyName
    if(req.body.companyName){
        const name_exist = await companyModel.findOne({companyName: req.body.companyName})
        if(name_exist){
            return next(new Error('name must be unique',{cause: 409}))
        }
    }
    //if update companyEmail
    if(req.body.companyEmail){
        const email_exist = await companyModel.findOne({companyEmail: req.body.companyEmail})
        if(email_exist){
            return next(new Error('email must be unique',{cause: 409}))
        }
    }
    //update company
   const updated = await companyModel.findOneAndUpdate({_id : companyId},req.body,{new : true})

   return res.status(200).json({message:"updated sucessfully",updated}) 

})

// 4. Delete company data
export const deleteCompanyData = asyncHandler(async (req, res, next) => {
    //get data fron req
    const { companyId } = req.params
    //check company exist 
    const company = await companyModel.findOne({_id:companyId})
    if(!company){
        return next(new Error("company not found",{cause:404}))
    }
    //check if you're owner
    if(!company.companyHR.equals(req.user._id)){
        return next(new Error("you are not the owner of company",{cause:400}))
    }
    //delete company
    const deleteAccount = await companyModel.findByIdAndDelete({_id:companyId})
    res.status(200).json({message:"deleted successfully"})
})


// 5. Search for a company with a name. 
export const searchForCompany = asyncHandler(async (req, res, next) => {
    //get data from req
    const { companyName } = req.query;
    //check company exist
    const company = await companyModel.findOne({ companyName })
    if (!company) {
        return next(new Error("company not found",{cause:404}))
    }
    res.status(200).json({ message: "Company found", company });
    
})


// 6. Get all applications for specific Jobs
export const getAllApplications = asyncHandler(async(req,res,next)=>{
      //get data from req
      const { companyId } = req.body
      //check if company exist
  const Company = await companyModel.findById({_id : companyId})
  if (! Company){
      return next(new Error('company not found'),{cause:404})
  }
       //check if you're owner
        if(!Company.companyHR.equals(req.user._id)){
            return next(new Error("you are not the owner of company",{cause:400}))
        }
    //find jobs for specific company   
   const jobs = await jobModel.find({companyId:Company._id})

   //push jobs ids
 const jobIds = []

 for (const job of jobs) {
     jobIds.push(job._id);
 }
 
 // 3. Retrieve all applications for the found jobs
 const applications = await applicationModel.find({ jobId: { $in: jobIds } }).populate('userId', 'firstName lastName email');
   return res.status(200).json({message:"done",applications}) 

})


//add an endpoint that collects the applications for a specific company on a specific day
// and create an Excel sheet with this data
export const applicationsOnday = asyncHandler(async(req,res,next)=>{
      //get data from req
      const { companyId , date} = req.body
      //check if company exist
  const Company = await companyModel.findById({_id : companyId})
if (! Company){
    return next(new Error('company not found'),{cause:404})
}
      //check if you're owner
      if(!Company.companyHR.equals(req.user._id)){
          return next(new Error("you are not the owner of company",{cause:400}))
      }
  //find jobs for specific company   
 const jobs = await jobModel.find({companyId:Company._id})

 //push jobs ids
const jobIds = []

for (const job of jobs) {
   jobIds.push(job._id);
}
    // Convert the date string to a Date object
    const searchDate = new Date(date);
//Retrieve all applications for the found jobs
const applications = await applicationModel.find({
    jobId: { $in: jobIds },
    createdAt: {
        $gte: new Date(searchDate.setHours(0, 0, 0)), 
        $lt: new Date(searchDate.setHours(23, 59, 59)) 
    }
}).populate({
     path :'userId' , 
     select :'userName email mobileNumber gender DOB'
    })

    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Add headers
    worksheet.addRow(['User Name', 'Email', 'Mobile Number', 'Gender', 'Date of Birth','userSoftSkills','userTechSkills','jobId','userResume']);

    // Add data
    applications.forEach(application => {
        const { userSoftSkills, userTechSkills, jobId, userResume } = application;
        const { userName, email, mobileNumber, gender, DOB } = application.userId;
        worksheet.addRow([
            userName, email, mobileNumber, gender, DOB,
            userSoftSkills.join(', '), userTechSkills.join(', '), jobId, userResume.secure_url
        ])
    })

 //Generate file path
    const filePath = join(dirname(fileURLToPath(import.meta.url)), 'applications.xlsx');

 // Write Excel file
 await workbook.xlsx.writeFile(filePath);

    // Res
    return res.status(200).json({ message: 'Excel sheet created successfully', filePath });

})
