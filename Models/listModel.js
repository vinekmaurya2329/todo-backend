const mongoose = require('mongoose');
 const listSchema = mongoose.Schema({
  title:{
    type:String,
    require:true
  },
  discription:{
    type:String,
    require:true
  },
  date:{
    type:Date,
    
  },
  user:{
    type:mongoose.Schema.Types.ObjectId
  }
},{timestamps:true})

const listModel = mongoose.model('lists',listSchema);

module.exports = listModel;