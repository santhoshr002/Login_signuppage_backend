const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const register = require('./models/schema');
// const contactDetails = require('./models/userData');
// const displayDetails = require('./models/displayschema');
//const session = require('express-session');
//const flash = require('flash');
let alert = require('alert'); 

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/web')
.then(()=>console.log('connected!'));

const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
 });

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.get('/about', (req, res) => {
   res.sendFile(__dirname + '/public/user.html');
})
app.get('/display', (req, res) => {
   res.sendFile(__dirname + '/display/userindex.html');
})


app.post('/api/create',  async (req, res, next) => {
    
      try {
         const user = await register.find({username:req.body.username,
         password:req.body.password});
         console.log(user.length);
         console.log(user)
         if(!user.length){
            try {
               const{username, password}=req.body;
               const user_data = await register.create({username,password});
               console.log(user_data);
               return res.status(201).json({ success: true, message: 'User created successfully' });
               } 
               catch (err) {
               console.log(err)           
               return res.status(401).json()
               }
         }
         else{
         console.log("found")
         return res.status(201).json({success:false, message:'user already found'});
         }
      }
      catch (err){
         console.log(err);
         return res.status(500).json({
             success: false,
             error : 'server error'
         });
     }
     
     
 });

 app.post('/api/Login',  async (req, res, next) => {
    
   try {
      const user = await register.find({
         username:req.body.username,
         password:req.body.password});
     // console.log(user.length);  
      console.log(req.body);
      if(user.length){
        
       res.status(201).json({
               success: true,
               message:'User successfully login'
           });
      }
      else{
        // res.redirect('/');
         return res.status(201).json({
            success:false,
            message : 'User  not found',
            //error : messages
        })
     
      }
  
   }
   catch (err){
      console.log(err);
      return res.status(500).json({
          success: false,
          error : 'server error'
      });
  } 
});



app.post('/api/enter',  async (req, res, next) => {
   try {
     
     const{fname, lname, dob, age, bgroup, phone, city, state, pin}=req.body;
     
     const userdata = await contactDetails.create({fname, lname, dob, age, bgroup, phone, city, state, pin});
     //res.send(req.body);
     console.log(userdata);
     res.redirect('/display');
   //   res.status(201).json({
   //   message : "success",
   //   data : userdata
     
   //  })
   } catch (err) {
     console.log(err)
     res.status(401).json({
       message: "User not successful created",
       error: err.message,
     })
   }
 })




app.post('/api/display',   (req, res, next) => {
    
   try {
      const blood_ = req.body.blood;
      const place_ = req.body.place;
      console.log(req.body);

      contactDetails.find({bgroup:blood_, city:place_})
      .then((result)=>{
         if(result.length>0){
            console.log(result.length);
           // res.write(JSON.stringify({"firstname": result.fname, "lastname" : result.lname}));
         res.status(200).json({
            //message:"success",
            
           "firstname":result[0].fname,
          "Lastname":result[0].lname,
         
         //   "Blood Group":result[0].bgroup,
         //   "Age": result[0].age,
         //   "Phone Number" : result[0].phone
         })   
      }
      
         else{console.log("not found");}
      })
      
   }
   catch (err){
      console.log(err);
      return res.status(500).json({
          success: false,
          error : 'server error'
      });
  } 
});



app.get('/dashboard', (req, res) => {
   res.send('Welcome to the dashboard!');
 });

 app.listen(3000,()=>{
   console.log("server running");
});
 




   

