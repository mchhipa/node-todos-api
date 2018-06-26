
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
function validator (v) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
  };
  var custom = [validator,'{VALUE} is not a valid email address!']
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email:{
        type: String,
        validate: custom,
        required: [true, 'User email required'],
        trim:true
    }
})
userSchema.pre('save',(next)=>{
    console.log('pre save');
    next();
});
const User = mongoose.model('User',userSchema);
module.exports = {User}