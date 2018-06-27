const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID} =require('mongodb');

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
        res.send(result);
        console.log(result);
    },(err)=>{
        res.statusStatus(400).send(err);
        throw new Error("Error Saving todo",err)
    })
});
app.get('/todos',(req,res)=>{
    Todo.find({}).then((todos)=>{
        res.send(todos);
    },(err)=>{
        res.sendStatus(400);
        res,send(err);
        //throw new Error("error fetching")
    })
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
            res.send(todo)
        });
        
});
app.listen('3000',()=>{
    console.log('started server on 3000');
})

module.exports = {app}