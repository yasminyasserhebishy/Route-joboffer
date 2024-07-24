import {Schema , Types, model } from 'mongoose'

const userSchema = new Schema ({
    firstName:{
    type: String , 
    required : [true , "firstName required"] ,
    min : [3,'minimum length 3 char'],
    max : [20,'max length 20 char'],
    lowercase : true 
},
    lastName:{
        type : String , 
        required : [true , "lastName required"] ,
        min : [3,'minimum length 3 char'],
        max : [20,'max length 20 char'],
        lowercase : true ,
},
    userName : {
        type : String , 
        unique : [true, 'userNmae must be unique']
    },
     email:{
        type : String , 
        required : [true , 'email must be required'] ,
        unique : [true, 'email must be unique']
     },
     password :{
        type : String , 
        required : [true, 'password must be required'] 
     },
     recoveryEmail : String ,
     mobileNumber:{
        type : String,
        unique : [true, 'mobileNumber must be unique'],
        required : [true , "mobileNumber required"] 
     },
    gender:{
        type : String , 
        enum : ['female','male'],
        default : 'female'
    },
    role :{
        type:String,
        default : 'User',
        enum :['User','Company_HR']

    },
    status:{
        type:String,
        default :'Offline',
        enum : ['Offline','Online']
    },
    confirmEmail : {
        type : Boolean , 
        default : false 
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    DOB: String,
      code:String
},{timestamps:true})


const userModel = model('User', userSchema)

export default userModel