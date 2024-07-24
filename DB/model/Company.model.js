import mongoose,{ Schema,model ,Types} from "mongoose";

const companySchema = new Schema ({
    companyName :{
        type : String ,
        required : [true , 'companyName must be required'],
        unique : [true , 'companyName must be unique' ],
        trim :true ,
        lowercase : true 
    },
    description :String ,
    address:String,
    companyEmail :{
        type : String ,
        required : [true , 'companyEmail must be required'],
        unique : [true , 'companyName must be unique' ],
    },
    industry:String,
    numberOfEmployees: {
        from: Number,
        to:Number
    },
    isDeleted : {
        type : Boolean ,
        default : false 
    },
    companyHR :{
        type : Types.ObjectId,
        ref : 'User',
    }
},{
    timestamps :true,
    toJSON :{virtuals:true},
    toObject :{virtuals : true}
})

companySchema.virtual('Job', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'companyId'
  });
// mongoose.model.Company ||
const companyModel = model('Company',companySchema)
export default companyModel