const express = require('express')
const app = express()
const cors  = require('cors');
const userModel = require('./Models/userModel')

const listModel = require('./Models/listModel')
const {hashPassword,comparePassword} = require('./middlewares/hashingPass')
require('dotenv').config()

const db = require('./db')


const PORT = process.env.PORT 
app.use(cors())
app.use(express.json())
var GlobalEmail ;
app.get('/',(req,res)=>{ 
    res.send('<h1>hello from homepage </h1>')
})

// register API

app.post('/register', async (req,res)=>{
    const {name,email,number,password} = req.body;
    if(!email){
        return  res.send({
              message:'Please Enter Email',
              ft:'opps!',
              lt:'error'
          })
      }
      if(!password){
          return  res.send({
                message:'Please Enter Password',
                ft:'opps!',
                lt:'error'
            })
        }if(!number){
            return  res.send({
                  message:'Please Enter Number',
                  ft:'opps!',
                  lt:'error'
              })
          }
          if(!name){
              return  res.send({
                    message:'Please Enter name',
                    ft:'opps!',
                    lt:'error'
                })
            }
    const existUser = await userModel.find({email:email});
    if(existUser.length >0){
        return res.status(200).send({
            message:' user already register',
            user:existUser,
            ft:'opps!',
            lt:'info'
            
        })
    }
    const hashedPassword = await hashPassword(password)
    const user =  await userModel.create({name:name,email:email,number:number,password:hashedPassword})
  res.send({
     message:'user created successfully',
     user:user,
     ft:'congrats',
     lt:'success'
  })
 })

//   login API      

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    if(!email){
      return  res.send({
            message:'Please Enter Email',
            ft:'opps!',
            lt:'error'
        })
    }
    if(!password){
        return  res.send({
              message:'Please Enter Password',
              ft:'opps!',
              lt:'error'
          })
      }
    const checkUser = await userModel.findOne({email:email})
   

if(!checkUser){ 
     return res.send({
         message:'email is not registered',
        ft:'opps!',
        lt:'error'
    })
}
const match = await comparePassword(password,checkUser.password)
    
    if(!match){
        return res.send({
            message:'Invalid Pasword',
            ft:'opps!',
            lt:'error'
        })
    }
    res.send({
        message:'login successfully',
        ft:'congrats',
        lt:'success',
        user:checkUser
    })

    
})
 
app.post('/setlist',async (req,res)=>{
    const {title,date,discription,email} = req.body;
    if(!title){
        return res.send({
            message:'please enter title',
            ft:'opps!',
            lt:'info'
        })
    }
    if(!date){
        return res.send({
            message:'please select date',
            ft:'opps!',
            lt:'info'
        })
    }
    if(!discription){
        return res.send({
            message:'please enter some  discription ',
            ft:'opps!',
            lt:'info'
        })
    }
     GlobalEmail = email;
    const user = await userModel.findOne({email:email})
    
  const lists = await listModel.create({title:title,date:date,discription:discription,user:user._id});
 
    user.list.push(lists._id)
   await user.save()
  res.send({
    message:'list added successfully',
    ft:'Done',
    lt:'success',
    list:lists
  })
})
app.post('/allLists',async (req,res)=>{ 
    const {email} = req.body;
     const user = await userModel.findOne({email:email}).populate('list')
     
    
    res.send({
        message:'all lists',
        lists:user.list  
    })
    
})

// delete list - -- -- -- -- - -- 

app.delete('/deleteList/:deleteId',async (req,res)=>{ 
    const {deleteId} = req.params;
   
    const lists = await listModel.findByIdAndDelete(deleteId) ;
   
    

    res.send({
        message:'List Deleted Successfully',
        ft:'done',
        lt:'success',
        lists:lists
    })

}) 
//  update list Api

app.put('/updatelist/:updateId',async (req,res)=>{
    const {updateId}= req.params;
    const {title,date,discription} =req.body;
  
     const updatedList = await listModel.findByIdAndUpdate(updateId,{title:title,date:date,discription:discription})
     res.send({
        message:'list Updated successfully',
        ft:'Done',
        lt:'success',
        lists:updatedList
     })
})

app.listen(PORT,()=>{
    console.log(`server is started now on port ${PORT}`); 
}) 

