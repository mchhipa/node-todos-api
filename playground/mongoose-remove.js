const {ObjectID}=require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

Todo.remove({}).then((result)=>{
    console.log(result);
},(err)=>{
    console.log("Error remoing all records",err);
});

// Todo.findOneAndRemove().then((result)=>{

// });
const todos=[{
    _id: new ObjectID(),
    text:"create todo app"
},{
    _id:new ObjectID(),
    text:"update resume",
}];
Todo.insertMany(todos).then((docs)=>{
    console.log(docs);
},(err)=>{        
       throw new Error("Error creating documents",err);
    });
Todo.findByIdAndRemove(todos[0]._id.toHexString()).then((todo)=>{
    console.log(todo);
},(err)=>{
    throw new Error("Error removing the status",err);
})
