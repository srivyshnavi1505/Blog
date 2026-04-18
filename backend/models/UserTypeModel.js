import { Schema,model } from "mongoose";

const UserSchema = new Schema({
    firstName : {
        type :String,
        required: [true,"First name is required"]
    },
    lastName : {
        type :String,
        required: [true,"last name is required"]
    },
    email: {
        type :String,
        required: [true,"email is required"],
        unique : [true,"email already exists"]
    },
    password : {
        type: String,
        required : [true, " password is needed"]
    }
    ,
    ProfileImageUrl : {
        type :String,
        
    },
    role : {
        type: String,
        enum: ["AUTHOR","USER","ADMIN"],
        required : [true, " role is required "],
    },
    isActive :{
        type : Boolean,
        default: true,
    }
},{
    timestamps:true,
    strict: true , //currently removed throw
    versionKey : false

})

export const UserTypeModel = model('User',UserSchema);
