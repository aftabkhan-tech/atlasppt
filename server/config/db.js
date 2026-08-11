import mongoose from "mongoose";
const connectdb= async ()=>{
    try{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("database connected")
    } catch(error){
       console.log(error)
    }
}
export default connectdb 
// mongodb+srv://aftabkhan918276_db_user:dBfArnphoCvefxgt@cluster0.lwufab9.mongodb.net/
