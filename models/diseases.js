const mongoose=require("mongoose");
const schema=mongoose.Schema;
const diseaseSchema=new mongoose.Schema({
    diseaseName:String,
    productId:String
})

module.exports=mongoose.model("Disease",diseaseSchema)