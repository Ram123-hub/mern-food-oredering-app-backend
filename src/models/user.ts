import { ObjectId } from "mongodb";
import mongoose from  "mongoose";

const userSchema = new mongoose.Schema({
   _id:ObjectId,
   
    auth0Id:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    addressLine1:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{
        type:String
    },
})
//This is the name of the collection in the database
const User = mongoose.model("User",userSchema);
export default User;

