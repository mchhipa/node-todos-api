const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID} =require('mongodb');
const _ = require('lodash');

const { mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Todo} = require('./models/todo');

const app = express();
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    console.log(req.body);
    const todo = new Todo({
        text: req.body.text
    })
    todo.save().then((result)=>{
       return res.send(result);
        //console.log(result);
    },(err)=>{
      return  res.sendStatus(400).send(err);
        //throw new Error("Error Saving todo",err)
    })
});
app.get('/todos',(req,res)=>{
    Todo.find({}).then((todos)=>{
        return res.send(todos);
    },(err)=>{
       return res.sendStatus(400).send(err);
        
    });
});
app.get('/todo/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
       return  res.sendStatus(404).end();
    }
    Todo.findById(req.params.id)
        .then((todo)=> {
            if(!todo){
                return res.sendStatus(404).send();
            }
            return res.send(todo)
        });
        
});
app.delete('/todo/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return  res.sendStatus(404).end();
     }
     Todo.findByIdAndRemove(req.params.id)
        .then((todo)=> {
            if(!todo){
                return res.sendStatus(404).send();
            }
            return res.send(todo);
        });
});
app.patch('/todo/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return  res.sendStatus(404).end();
     }
     console.log(req.body);
     let newTodo = _.pick(req.body,["text","completed"]);

     if(_.isBoolean(newTodo.completed) && newTodo.completed){
         newTodo.completedAt = new Date().getTime();
     }else{
         newTodo.completed = false;
         newTodo.completedAt = null;
     }
     Todo.findOneAndUpdate(req.params.id,{$set:newTodo},{new: true}).then((todo)=>{
         if(!todo){
             return res.status(404).send();
         }
        res.send(todo);
            }).catch((err)=>res.status(400).send());
        });


app.listen('3000',()=>{
    console.log('started server on 3000');
})

module.exports = {app}