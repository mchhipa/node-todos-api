const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos=[{
    text:"create todo app"
},{
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
        Todo.insertMany(todos,(err,docs)=>{
            if(err){
                console.log(err);
               return done(err);
            }
            console.log(docs);
            done();
        });
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
        })

    })
})