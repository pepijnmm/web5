process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Race = require('../models/race');
let User = require('../models/user');
let Waypoint = require('../models/waypoint');



let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app').app;
let should = chai.should();
const expect = chai.expect;

//
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// //let server = require('../server');
// let should = chai.should();


// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const expect = chai.expect;
// const mlog = require('mocha-logger');
 //const request = require('supertest');
// const should = require('chai').should();
chai.use(chaiHttp);
// describe('RemoveEverything', () => {
//
// });
describe("usersettings", ()=>{
    before((done) => { //Before each test we empty the
        // Race.collection.drop();
        // User.collection.drop();
        // Waypoint.collection.drop();
        // Race.find({}).then(race => {
        //     if(!race.length){
        //         require('../models/fillTestData')
        //             .then()
        //             .catch();
        //     }
        // });
        done();
    });
    after(function() {
        // runs after all tests in this block
    });
    describe("should login", ()=>{
        it("should accept password and email",(done)=> {
            chai.request(app).post('/login')
                .field('email', 'admin@gmail.com')
                .field('password', 'test123')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    !res.should.have.status(200);
                    expect('Location', '/login');
                    done();
                });
        });
        it("should not accept wrong email for user");
        it("should not accept wrong password for user");
        it("should show profile page");
    });
    describe("should logout", ()=>{
        it("should logout");
        it("is already logout");
    });
    describe("should signin", ()=>{
        it('should signin');
    });
    describe("should notsignin", ()=>{
        it("account already in use");
        it("email doesnt meet the requirments");
        it("password doesnt meet the requirments");
    });
});
describe("race", ()=>{
    describe("not signin can do", ()=> {
        it("does not get races html page");
    });
    describe("user can do", ()=>{
        it("can not go to create races");
        describe("getlocation", ()=> {
            it("send incorrect details");
            it("send correct detauls");
        });
        describe("getAll races", ()=> {
            it("json show all races");
            it("html show all races");
        });
        describe("get one races", ()=> {
            it("json show one races");
            it("html show one races");
        });
    });
    describe("user can not do", ()=>{
        describe("enable", ()=> {
            it("cannot send data to enable function");
        });
    });
    describe("admin can do", ()=>{
        describe("enable", ()=> {
            it("can change disable to enable");
        });
        describe("Create", ()=> {
            it("can create change race");
            it("can not create race with same name");
        });
        describe("edit", ()=> {
            it("can change change race");
            it("can not change function if no race is found");
        });
        describe("delete", ()=> {
            it("can delete change race");
            it("can not do delete function if no race is found");
        });
    });
});
describe("waypoints", ()=>{
    describe("not signin can do", ()=> {
        it("does not get waypoint page html page");
    });
    describe("user can do", ()=>{
        it("can not go to create waypoint");
        describe("check", ()=> {
            it("send incorrect details");
            it("send correct details");
        });
        describe("get one races", ()=> {
            it("json show one races");
            it("html show one races");
        });
        describe("location", ()=> {
            it("send incorrect details");
            it("send correct details");
        });
    });
    describe("user can not do", ()=>{
        describe("posts", ()=> {
            it("cannot send data to posts function");
        });
    });
    describe("admin can do", ()=>{
        describe("getWaypoints", ()=> {
            it("can get data");
        });
        describe("getCreate", ()=> {
            it("can get data");
        });
        describe("posts", ()=> {
            it("can add new waypoints");
        });
        describe("delete", ()=> {
            it("can delete change race");
            it("can not do delete function if no race is found");
        });
    });
});


// var app = require("../app').app;
// request(app)
//     .get('/login')
//     // .expect('Content-Type', /json/)
//     // .expect('Content-Length', '15')
//     .expect(200)
//     .end(function(err, res) {
//         console.log(res.body);
//         if (err) throw err;
//     });
// chai.use(chaiHttp);
// describe('/GET book', () => {
//     it('it should GET all the books', (done) => {
//         chai.request(app)
//             .get('/login')
//             .end((err, res) => {
//                 console.log(res.body);
//                 res.should.have.status(200);
//                 //res.body.should.be.a('array');
//                 //res.body.length.should.be.eql(0);
//                 done();
//             });
//     });
// });
// function makeRequest(route, statusCode, done){
//     request(app)
//         .get(route)
//         .expect(statusCode)
//         .end(function(err, res){
//             if(err){ return done(err); }
//
//             done(null, res);
//         });
// };
//
// describe('test as not loggedin', function() {
//     it("go to login page", function(done) {
//         makeRequest('/login', 200, function(err, res){
//             if(err){ return done(err); }
//             console.log("__________________________");
//             console.log("__________________________");
//             console.log("__________________________");
//             console.log("__________________________");
//             console.log(res.body);
//             mlog.log('body:', JSON.stringify(res.body));
//             expect(res.body).to.have.property('login');
//             done();
//         });
//     });
//     it("redirect to login page", function(done) {
//         request(app).get('/login')
//             .expect('Location', '/login')
//             .end(done);
//     })
// });
