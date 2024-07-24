import roles from "../../utils/roles.js"

const userEndpoint = {
  update: [roles.User, roles.company_HR],
  delete: [roles.User, roles.company_HR],
  getData: [roles.User, roles.company_HR],
  updatePassword: [roles.User, roles.company_HR]
};
export default userEndpoint