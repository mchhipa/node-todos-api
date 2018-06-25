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
    db.collection('Users').findOneAndDelete({
       _id :new ObjectID("5b2fdf86f933256500dbbc1e")
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