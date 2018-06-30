require('./config/config.js')
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID} =require('mongodb');
const _ = require('lodash');




const { mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');
const {authenticate}=require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());
app.post('/todos',authenticate,(req,res)=>{

    const todo = new Todo({
        text: req.body.text,
        createdBy: req.user._id
    })
    todo.save().then((doc)=>{
       res.send(doc);
        //console.log(result);
    },(e)=>{
        res.status(400).send(e);
    })
});
app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        createdBy: req.user._id
    }).then((todos)=>{
        return res.send(todos);
    },(err)=>{
       return res.status(400).send(err);
        
    });
});
app.get('/todo/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
       return  res.status(404).end();
    }
    Todo.findOne({
                createdBy: req.user._id,
                _id: req.params.id
            }).then((todo)=> {
                    if(!todo){
                        return res.status(404).send();
                    }
                        return res.send(todo)
            }).catch((e)=>done(e));
    });
app.delete('/todo/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return  res.status(404).end();
     }
     Todo.findOneAndRemove({
            createdBy: req.user._id,
            _id: req.params.id
        })
        .then((todo)=> {
            if(!todo){
                return res.status(404).send({});
            }
            return res.send(todo);
        });
});
app.patch('/todo/:id',authenticate,(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return  res.status(404).end();
     }
     console.log(req.body);
     let newTodo = _.pick(req.body,["text","completed"]);

     if(_.isBoolean(newTodo.completed) && newTodo.completed){
         newTodo.completedAt = new Date().getTime();
     }else{
         newTodo.completed = false;
         newTodo.completedAt = null;
     }
     Todo.findOneAndUpdate({
                    createdBy: req.user._id,
                    _id: req.params.id
                },{$set:newTodo},{new: true}).then((todo)=>{
         if(!todo){
             return res.status(404).send();
         }
        res.send(todo);
            }).catch((err)=>res.status(400).send(err));
        });

app.post('/users',(req,res)=>{
            //console.log(req.body);
        let body = _.pick(req.body,["email","password"])
            
        let user = new User(body);
          //  console.log(user);
       user.save().then(()=>{
            return user.generateAuthToken();
                
            }).then((token)=>{
                res.header('x-auth',token).send(user);
            }).catch((err)=> {
                   // console.log(err)
                let message = JSON.stringify(err,undefined,2);
                    return res.status(400).send(message);
                });
    });
    app.post('/users/login',(req,res)=>{
       // console.log(req.body);
        let body = _.pick(req.body,["email","password"])
        
        User.findByCredentials(body.email,body.password).then((user)=>{
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);
              });                
        }).catch((e)=>{
            res.status(400).send("invalid email or password");
        });

});
    
app.get('/users/me',authenticate,(req,res)=>{
        res.send(req.user);
    });
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then((user)=>{
        res.status(200).send(user);
    }).catch(()=>send.status(400).send());
});
app.listen('3000',()=>{
    console.log('started server on 3000');
})

module.exports = {app}