const mongoose=require("mongoose");
const schema=mongoose.Schema;


const productSchema=new mongoose.Schema({
    title:String,
    price:Number,
    count:Number
})

module.exports=mongoose.model("Product",productSchema)
