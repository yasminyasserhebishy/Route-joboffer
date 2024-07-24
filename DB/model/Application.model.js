
import mongoose,{ Schema,model ,Types} from "mongoose";

const ApplicationSchema = new Schema ({
    userSoftSkills :[String],
    userTechSkills :[String],
    userResume :{
        type : Object,
        required : [true , 'userResume must be required']
    },
    jobId :{
        type : Types.ObjectId,
        ref : 'Company',
        required: [true , 'jobId must be required'] 
    },
    userId :{
        type : Types.ObjectId,
        ref : 'User',
        required: [true , 'userId must be required'] 
    }
},{
    timestamps :true
})

//mongoose.model.Application ||
const applicationModel =  model('Application',ApplicationSchema)
export default applicationModel