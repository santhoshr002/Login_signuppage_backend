const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   
    username:{
        type : String,
       // required :true
        // trim : true,
        // required : [true, 'please add some text']
    },
    password :{
        type :String,
       // required : true
        //required : [true, 'please add a positive number']
    },
   
    
});
module.exports = mongoose.model('register', UserSchema);

