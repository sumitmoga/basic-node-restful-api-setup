const mongoose=require('mongoose');

const userSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
         required:true,
          unique:true,
           match:/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i},
    password:{type:String, default:1}
});

module.exports= mongoose.model('User', userSchema);