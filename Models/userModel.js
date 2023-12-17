const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    number:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    list:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'lists'
    }]
},{timestamps:true})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel;