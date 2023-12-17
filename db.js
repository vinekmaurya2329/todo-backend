const mongoose = require('mongoose');
const url =process.env.DBURL
mongoose.connect(`${url}`)
.then(()=>{
    console.log('DB is now connected');
}).catch((error)=>{ 
    console.log('Error while connecting Db');
})
module.exports =  mongoose;