
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todo');
const {expect} = require('chai');
let chai = require('chai');
let chaiHttp =require('chai-http');
chai.use(chaiHttp)
chai.should();  // Modifies `Object.prototype`
chai.use(chaiHttp);
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);
        
describe("Post /todos",()=>{
    it('should create a new todo',(done)=>{
        let text = 'Test todo text';
        chai.request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({text})
            .end((err,res)=>{
                res.should.have.status(200);
              //  console.log(res.body.text)
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
            .set('x-auth',users[0].tokens[0].token)
            .send({})
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                res.should.have.status(400);

                User.find({}).then((todos)=>{
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((e)=>done(e))
                
            })
    })
}); 
    

describe('Get /todo/:id',()=>{
    it("should get todo with id", (done)=>  {      
        chai.request(app)
         .get(`/todo/${todos[0]._id.toHexString()}`)
         .set('x-auth',users[0].tokens[0].token)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(200);
             //console.log(res.body)
             expect(res.body.text).to.equal(todos[0].text);
             done();
         });
    });
    it("should not get todo with created by other user", (done)=>  {      
        chai.request(app)
         .get(`/todo/${todos[0]._id.toHexString()}`)
         .set('x-auth',users[1].tokens[0].token)
         .end((err,res) =>{
             if(err){
                 done(err);
             }
             res.should.have.status(404);            
             done();
         });
    });
    it("should get todo 404 not found", (done)=>  {  
        var objid = new ObjectID().toHexString();   
      //  console.log(objid);
        chai.request(app)
         .get(`/todo/${objid}`)
         .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
    it("should get all todos from the server",  (done)=> {
    //this.timeout(10000);
      chai.request(app)
        .get("/todos") 
        .set('x-auth',users[0].tokens[0].token)      
        .end((err,res)=>{
           // console.log(res.body);
             if(err){
                done(err);
             }
            res.should.have.status(200);
            expect(res.body.length).to.equal(1);
            done();
        })
    });
});
describe('DELETE /todo/:id',()=>{
    it("should delete todo with id created by user", (done )=>  {      
        chai.request(app)
         .delete(`/todo/${todos[0]._id.toHexString()}`)
         .set('x-auth',users[0].tokens[0].token)
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
    it("should not delete todo with id created by user", (done )=>  {      
        chai.request(app)
         .delete(`/todo/${todos[1]._id.toHexString()}`)
         .set('x-auth',users[0].tokens[0].token)
         .end((err,res) =>{
             expect(err).to.be.null;
             res.should.have.status(404);
             Todo.findById({_id:todos[1]._id}).then((todo)=>{
                expect(todo).to.not.equal(null);
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
         .set('x-auth',users[0].tokens[0].token)
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
                 expect(todo.text).to.equal(todos[0].text);
                 expect(todo.completedAt).to.be.a('number');
                 done();
             }).catch((err) => done(err))  
         });
    });
    it("should complted status to false with id", (done )=>  {  
        let todo = { completed:false }    
        chai.request(app)
         .patch(`/todo/${todos[0]._id.toHexString()}`)
         .set('x-auth',users[0].tokens[0].token)
         .send(todo)
         .end((err,res) =>{
             expect(err).to.be.null;
             res.should.have.status(200);
             //console.log(res.body.text)
             res.body.should.have.property("_id").eql(todos[0]._id.toHexString());
             Todo.findById({_id:todos[0]._id}).then((todo)=>{
                 expect(todo.text).to.equal(todos[0].text);
                 expect(todo.completed).to.equal(false);
                 expect(todo.completedAt).to.equal(null);
                 done();
             }).catch((err) => done(err))  
         });
    });
});
describe('GET /users/me',()=>{
    it("Should return user if authenticated",(done)=>{
       /// console.log(users[0].tokens[0].token);
        chai.request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal(users[0].email);
                expect(res.body._id).to.equal(users[0]._id.toHexString())
                done();
            });
    });
    it("Should return 401 if not authenticated",(done)=>{
        /// console.log(users[0].tokens[0].token);
         chai.request(app)
             .get('/users/me')
             .set('x-auth','123abc')
             .end((err,res)=>{
                 expect(err).to.be.null;
                 expect(res).to.have.status(401);
                 done();
             });
     });
});
describe("POST /users",()=>{
    it("should create a user",(done)=>{
        let email = "mehboob2@chhipa.com";
        let password = '123abc';
        chai.request(app)
            .post('/users')
            .send({email,password})
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header('x-auth');
                expect(res.body._id).to.not.null;
                User.findOne({email:email}).then((user)=>{
                    expect(user.email).to.equal(email);
                    expect(user.password).to.not.equal(password);                    
                    done();
                }).catch(()=>done())
            });
    });
    it("should return validation errors if request is invalid",(done)=>{
        let email = "mehboob2@chhipa";
        let password = '123abc';
        chai.request(app)
            .post('/users')
            .send({email,password})
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });
    it("should not create user if email in use",(done)=>{
        let email = "mehboob@chhipa.com";
        let password = '123abc';
        chai.request(app)
            .post('/users')
            .send({email,password})
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });
});
describe("POST /users/login",()=>{
    it("should get an authentication token for login",(done)=>{
        chai.request(app)
            .post('/users/login')
            .send({email:users[1].email,password:users[1].password})
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.email).to.equal(users[1].email);
                expect(res.body._id).to.equal(users[1]._id.toHexString());
                expect(res).to.have.header('x-auth');
               // console.log(res.header['x-auth'])
                User.findById(res.body._id).then((user)=>{
                    expect(user.tokens[1]).to.include({
                        access:'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((e)=>done(e));
               
            });
    });
    it("should return 400 if user not found",(done)=>{
        let email = "mehboob@chhipa.com";
        let password = '123abd';
        chai.request(app)
            .post('/users/login')
            .send({email,password})
            .end((err,res)=>{
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            });
    });
});
describe('DELETE /users/me/token',()=>{
    let token = users[0].tokens[0].token;
    it('should remove auth token on logtout',(done)=>{
        chai.request(app)
        .delete('/users/me/token')
        .set('x-auth',token)
        .end((err,res)=>{
            expect(err).to.be.null;
            expect(res).to.have.status(200);

            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).to.equal(0);
                done();
            }).catch((e)=>done(e))
        });
    });

});