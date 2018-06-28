const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos=[{
    _id: new ObjectID(),
    text:"create todo app"
},{
    _id:new ObjectID(),
    text:"update resume",
},{
    text:"write an email"
},{
    text:"walk the dog",
},{
    text:"check laundry"
},{
    text:"This is from postman"
}];
describe("Post /todos",()=>{
    beforeEach((done)=>{
        Todo.remove({}).then(()=>done());
    });
    it('should create a new todo',(done)=>{
        let text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                Todo.find({text:"Test todo text"}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>done(e))
            });
    });
    it('should not create todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e)=>done(e))
            })
    })
});

describe("GET /todos", ()=>{
    before((done)=>{
        Todo.insertMany(todos).then((docs)=>{
            console.log(docs);
            done();
        },(err)=>{        
               return done(err);
            })
        });
   
    it("should get all todos from the server", (done )=> {
       request(app)
        .get("/todos")
        .expect(200)
        .end((err,res)=>{
            if(err){
               return  done(err);
            }
            expect(res.body.length).toBe(6)
            done();
        });

    });
});
describe('Get /todo/:id',()=>{

    it("should get todo with id", (done )=>  {      
        request(app)
         .get(`/todo/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);            
        })
        .end(done())
    });
    it("should get todo 404 not found", (done)=>  {  
        var objid = new ObjectID().toHexString();   
        console.log(objid);
        request(app)
         .get(`/todo/${objid}`)
         .expect(404)        
        .end(done())
    });
    // it("should get 404 non objectid", (done)=> {
    //     //const id = new ObjectID().toHexString();
    //     request(app)
    //         .get("/todo/123")
    //         .expect(404)
    //         .end(done());
    // });
});