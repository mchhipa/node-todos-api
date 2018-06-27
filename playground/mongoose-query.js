const {ObjectID}=require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

let id = '5b33a6c8373308efa88244ef';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}else{
Todo.find({
    _id: id
}).then((todos)=>{
    console.log('Todos',todos);
})

Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log('todo',todo)
});
Todo.findById(id).then((todo)=>{
    if(!todo){throw new Error("OOps")}
    console.log(todo)
}).catch((e)=> console.log(e));
}