import  roles from "../../utils/roles.js"

const companyEndpoint ={
    addCompany : [roles.company_HR],
    getCompanyData : [roles.company_HR],
    updateCompanyData : [roles.company_HR],
    deleteCompany : [roles.company_HR],
    searchForCompany :[roles.company_HR,roles.User],
    allApplications:[roles.company_HR],
    applicationsOnday:[roles.company_HR]
}
export default companyEndpoint