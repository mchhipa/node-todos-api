const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
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
        res.status(400).send(err);
        throw new Error("Error Saving todo",err)
    })
})

app.listen('3000',()=>{
    console.log('started server on 3000');
})

module.exports = {app}