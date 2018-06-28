
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {expect} = require('chai');
let chai = require('chai');
let chaiHttp =require('chai-http');
chai.use(chaiHttp)
chai.should();  // Modifies `Object.prototype`
chai.use(chaiHttp);
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
beforeEach((done) => {
     Todo.remove({},(err)=>{
        Todo.insertMany(todos);
        done();
    });
    
});
        
describe("Post /todos",()=>{
    it('should create a new todo',(done)=>{
        let text = 'Test todo text';
        chai.request(app)
            .post('/todos')
            .send({text})
            .end((err,res)=>{
                res.should.have.status(200);
                console.log(res.body.text)
                res.body.should.have.property("text").eql(text);          
            
                Todo.find({text:"Test todo text"}).then((todos)=>{
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                }).catch((e)=>done(e))
            });
    });

    it('should not create todo with invalid body data',(done)=>{
        chai.request(app)
            .post('/todos')
            .send({})
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                res.should.have.status(400);
                done();
            })
    })
}); 
    

describe('Get /todo/:id',()=>{
    it("should get todo with id", (done )=>  {      
        chai.request(app)
         .get(`/todo/${todos[0]._id.toHexString()}`)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(200);
             console.log(res.body.text)
             res.body.should.have.property("text").eql(todos[0].text);
             done();
         });
    });
    it("should get todo 404 not found", (done)=>  {  
        var objid = new ObjectID().toHexString();   
        console.log(objid);
        chai.request(app)
         .get(`/todo/${objid}`)
         .end((err,res) =>{
            if(err){
                done(err);
            }
            res.should.have.status(404);
            done();
        });
    });
    it("should get 404 non objectid", (done)=> {
        //const id = new ObjectID().toHexString();
        chai.request(app)
            .get("/todo/123")
            .end((err,res) =>{
                if(err){
                    done(err);
                }
                res.should.have.status(404);
                done();
            });
    });
});
describe("GET /todos", ()=>{
      
    it("should get all todos from the server", (done )=> {
       chai.request(app)
        .get("/todos")       
        .end((err,res)=>{
            if(err){
               return  done(err);
            }
            res.should.have.status(200);
            expect(res.body.length).to.equal(6);
            done();
        });

    });
});
describe('DELETE /todo/:id',()=>{
    it("should get todo with id", (done )=>  {      
        chai.request(app)
         .delete(`/todo/${todos[0]._id.toHexString()}`)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(200);
             //console.log(res.body.text)
             res.body.should.have.property("_id").eql(todos[0]._id.toHexString());
             Todo.findById({_id:todos[0]._id}).then((todo)=>{
                 expect(todo).to.equal(null);
                 done();
             }).catch((err) => done(err)) 
             
         });
    });
});
describe('PATCH /todo/:id',()=>{
    it("should change the complted status to true todo with id", (done )=>  {  
        let todo = { completed:true }    
        chai.request(app)
         .patch(`/todo/${todos[0]._id.toHexString()}`)
         .send(todo)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(200);
             //console.log(res.body.text)
             res.body.should.have.property("_id").eql(todos[0]._id.toHexString());
             Todo.findById({_id:todos[0]._id}).then((todo)=>{
                 expect(todo.completed).to.equal(true);
                 expect(todo.completedAt).to.not.equal(null);
                 done();
             }).catch((err) => done(err))  
         });
    });
    it("should complted status to false with id", (done )=>  {  
        let todo = { completed:false }    
        chai.request(app)
         .patch(`/todo/${todos[0]._id.toHexString()}`)
         .send(todo)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(200);
             //console.log(res.body.text)
             res.body.should.have.property("_id").eql(todos[0]._id.toHexString());
             Todo.findById({_id:todos[0]._id}).then((todo)=>{
                 expect(todo.completed).to.equal(false);
                 expect(todo.completedAt).to.equal(null);
                 done();
             }).catch((err) => done(err))  
         });
    });
});