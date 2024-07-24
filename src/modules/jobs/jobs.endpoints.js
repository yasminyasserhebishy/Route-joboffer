import  roles from "../../utils/roles.js"

const jobsEndpoint ={
    addJob : [roles.company_HR],
    updateJob : [roles.company_HR],
    deleteJob : [roles.company_HR],
    searchForjobs :[roles.company_HR,roles.User],
    allJobsForCompany:[roles.company_HR,roles.User],
    filterJobs :[roles.company_HR,roles.User],
    applyToJob :[roles.User]
}
export default jobsEndpoint