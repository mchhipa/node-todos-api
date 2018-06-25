const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);



 MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{
    try {
        if(err){
             throw new Error(err);
        }
    console.log('connected to mongodb server');
    const db = client.db('TodosApp');
    
    // db.collection('Users').deleteMany({
    //    name:"mehboob chhipa"}
    //     ).then((result)=>{
    //     console.log(result);
    // },(err)=>{
    //     throw new Error(err);
    // });
    //findOneAndDelete
    // db.collection('Todos').findOneAndUpdate({
    //    _id :new ObjectID("5b31086ad0831ea002103166")
    // },{
    //     $set:{
    //         completed: true
    //      }
    //     },
    // {
    //     returnOriginal: false
    // }).then((result)=>{
    //         console.log(result);
    //     },(err)=>{
    //         throw new Error(err);
    // });
    db.collection('Users').findOneAndUpdate({
       _id :new ObjectID("5b2fdf4e5c66d3da0c3c83e3")
    },{
        $set:{
            name: "Mehboob Chhipa" 
         },
         $inc: { age: 1}
        },
    {
        returnOriginal: false
    }).then((result)=>{
            console.log(result);
        },(err)=>{
            throw new Error(err);
    });
    client.close()
}catch(err){
    console.log(err);
}
 });