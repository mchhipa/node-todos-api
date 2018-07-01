
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');



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
  //  console.log(token);
    try{
        //console.log(token);
        decoded = jwt.verify(token,process.env.JWT_SECRET);
        
    }catch(e){
          //  console.log(e)
            return Promise.reject(e)
    }
   // console.log(decoded)
    return User.findOne({
            '_id': decoded._id,
            'tokens.token':token,
            'tokens.access':'auth'
            });
    };
UserSchema.statics.findByCredentials = function(email,password){
        let User = this;
        let decoded;

       return User.findOne({email}).then((user)=>{
            if(!user){
                return Promise.reject()
            }
         //   console.log(user);
            return new Promise((resolve,reject)=>{
                bcrypt.compare(password,user.password,(err,res)=>{
                    if(res){
                        resolve(user)
                    }else{
                        reject();
                    }
                });               
            });
        });
                
};
UserSchema.methods.removeToken = function(token){
    let user = this;
   return user.update({
        $pull:{
            tokens:{
                token
            }
        }
    });
}
UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();

    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
}
UserSchema.methods.toJSON = function (){
    let user = this;
    return _.pick(user.toObject(),['_id','email']);

}
UserSchema.pre('save',function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        });
    }else{
            next();
    }
});
const User = mongoose.model('User',UserSchema);


module.exports = {User}