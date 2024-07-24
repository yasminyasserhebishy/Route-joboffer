import Router from "express"

import * as companyControl from "./controller/company.controller.js"
import validation from "../../middleware/validation.js"
import * as companyValidation from './company.validation.js'
import auth from "../../middleware/auth.js"
import companyEndpoint from "./company.endpoints.js"
const router = Router()

//add company
router.post('/addCompany',
validation(companyValidation.authSchema,true)
,auth(companyEndpoint.addCompany),
validation(companyValidation.addCompanySchema),
companyControl.addCompany)

//get company data
.get('/companyData/:companyId',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.getCompanyData),
validation(companyValidation.oneCompanySchema),
companyControl.getCompanyData)

//update company data
.put('/updateCompany/:companyId',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.updateCompanyData),
validation(companyValidation.updateCompanySchema),
companyControl.updateCompanyData)
//delete company
.delete('/deleteCompany/:companyId',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.deleteCompany),
validation(companyValidation.deleteCompanySchema),
companyControl.deleteCompanyData)

//search
.get('/search/',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.searchForCompany),
validation(companyValidation.searchForCompanySchema),
companyControl.searchForCompany)

//allApplications
.get('/allApplications/',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.allApplications),
validation(companyValidation.allApplicationsSchema),
companyControl.getAllApplications)

//applications On specific day
.get('/applicationsOnday/',
validation(companyValidation.authSchema,true),
auth(companyEndpoint.applicationsOnday),
validation(companyValidation.applicationsOnday),
companyControl.applicationsOnday)

export default router