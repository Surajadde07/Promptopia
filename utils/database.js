import mongoose, { mongo } from "mongoose";

let isConnected = false; // tarcking the connection state

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); // Set strictQuery to true

    if(isConnected){
        console.log("MognoDB is already connected");
        return;
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName : "share_prompt",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        isConnected = true;
        console.log("MongoDB connected");
    }
    catch(error){
        console.log("MongoDB connection error: ", error);
    }

}
