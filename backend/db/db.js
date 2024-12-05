import mongoose from "mongoose";

export async function connectToDb(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (error) {
        console.log(error)
    }
}

