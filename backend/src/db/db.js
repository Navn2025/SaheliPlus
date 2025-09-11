const mongoose=require("mongoose");

async function connectToDb()
{
    try
    {
        await mongoose.connect(process.env.MONGODB_URI, {


            serverSelectionTimeoutMS: 5000, // avoid long hangs
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err)
    {
        console.error("❌ Error connecting to MongoDB:", err.message);
    }
}

module.exports=connectToDb;
