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
    
    db.collection('Todos').find({
        _id: new ObjectID("5b2fd609543e01b558d3ee0b")}
        ).toArray().then((docs)=>{
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        throw new Error(err);
    });
    client.close()
}catch(err){
    console.log(err);
}
 });