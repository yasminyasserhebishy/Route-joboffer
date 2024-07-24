import mongoose,{ Schema,model ,Types} from "mongoose";

const jobSchema = new Schema ({
    jobTitle :{
        type : String ,
        required : [true , 'jobTitle must be required']
    },
    jobLocation:{
        type:String,
        enum : ['Remotly','Onsite','hybrid'],
        required : [true , 'jobLocation must be required']
    },
    workingTime:{
        type:String,
        enum : ['part-time','full-time'],
        required : [true , 'workingTime must be required']
    },
    seniorityLevel:{
        type:String,
        enum:['Junior', 'Mid-Level', 'Senior','Team-Lead', 'CTO'],
        required : [true , 'seniorityLevel must be required']
    },
    jobDescription:String,
    technicalSkills:[String],
    softSkills :[String],
    addedBy :{
        type : Types.ObjectId,
        ref : 'User',
        required: [true , 'user must be required'] 
    },
    companyId:{
        type : Types.ObjectId,
        ref : 'Company'
    }
},{
    timestamps :true,
})

//mongoose.model.Job ||
const jobModel =  model('Job',jobSchema)
export default jobModel