
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address!'
        },
        required: true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});
UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;
    console.log(token);
    try{
        //console.log(token);
        decoded = jwt.verify(token,'p@ssword');
        
    }catch(e){
            console.log(e)
            return Promise.reject(e)
    }
    console.log(decoded)
    return User.findOne({
            '_id': decoded._id,
            'tokens.token':token,
            'tokens.access':'auth'
            });
    };
UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(),access},'p@ssword').toString();

    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}
UserSchema.methods.toJSON = function (){
    let user = this;
    return _.pick(user.toObject(),['_id','email']);

}
const User = mongoose.model('User',UserSchema);


module.exports = {User}