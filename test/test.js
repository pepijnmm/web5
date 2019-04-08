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

chai.use(chaiHttp);
var admin = chai.request.agent(app);
var user = chai.request.agent(app);
var tokenadmin = '';
var tokenuser = '';
describe("usersettings", ()=>{
    before( (done) => { //Before each test we empty the
         Race.find({}).then(race => {
            Race.collection.drop();
             User.collection.drop();
             Waypoint.collection.drop().then(()=>{
                 Race.find({}).then(race => {
                     if (!race.length) {
                         require('../models/fillTestData')
                             .then(() => {
                                 done();
                             })
                             .catch(() => {
                             });

                     } else {
                         done();
                     }
                 });
             });
        });
    });
    after(function() {
        // runs after all tests in this block
    });
    describe("login", ()=>{
        it("should accept password and email",(done)=> {
            admin.post('/login')
                .send('email=admin@gmail.com')
                .send('password=test123')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.text.should.not.contain("No user found");
                    //console.log(res.req.res.headers['set-cookie']);
                    tokenadmin = res.text;
                });
            user.post('/login')
                .send('email=test123@gmail.com')
                .send('password=test123')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.text.should.not.contain("No user found");
                    //console.log(res.req.res.headers['set-cookie']);
                    tokenuser = res.text;
                    done();
                });
        });
        it("should not accept wrong email for user",(done)=> {
            chai.request(app).post('/login')
                .send('email=hoi@gmail.com')
                .send('password=test123')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it("should not accept wrong password for user",(done)=> {
            chai.request(app).post('/login')
                .send('email=admin@gmail.com')
                .send('password=test')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.contain("Wrong password");
                    done();
                });
        });
        it("should show profile page",(done)=> {
            var requester = chai.request.agent(app);
            requester.post('/login')
                .send('email=admin@gmail.com')
                .send('password=test123')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res).to.be.html;
                    res.text.should.include("<div class=\"card-header\">Profile</div>");
                    requester.close();
                    done();
                });
        });
    });
    describe("logout", ()=>{
        it("should logout",(done)=>{
            chai.request(app).get('/logout')
            .set('Authorization', tokenuser)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res).to.be.html;
                res.text.should.include("<div class=\"card-header\">Login</div>");
                done();
            });});
        it("is already logout",(done)=> {
            chai.request(app).post('/logout')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.contain("Unauthorized");
                    done();
                });});
    });
    describe("signup", ()=>{
        it('should signup',(done)=> {
            chai.request(app).post('/signup')
                .send('email=admin123@gmail.com')
                .send('password=testtest123')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.contain("<div class=\"card-header\">Login</div>");
                    done();
                });
        });
        it("account already in use",(done)=> {
            chai.request(app).post('/signup')
                .send('email=admin123@gmail.com')
                .send('password=testtest1343')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.text.should.contain("email taken");
                    done();
                });
        });
        it("email doesnt meet the requirments",(done)=> {
            chai.request(app).post('/signup')
                .send('email=admin.123@gmail.com')
                .send('password=testtest1343')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.text.should.contain("User validation failed: local.email: Email is not in the right format");
                    done();
                });
        });
        it("password doesnt meet the requirments",(done)=> {
            chai.request(app).post('/signup')
                .send('email=admin1234@gmail.com')
                .send('password=tes')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, res) => {
                    res.text.should.contain("Password must be length of 8 and contain 1 letter and 1 number");
                    done();
                });
        });
    });
});
describe("race", ()=>{
    describe("not signin can do", ()=> {
        it("does not get races html page",(done)=> {
            chai.request(app).get('/races')
                .end((err, res) => {
                    res.text.should.contain("<div class=\"card-header\">Login</div>");
                    done();
                });
        });
    });
    describe("user can do", ()=>{
        it("can not go to create races",(done)=> {
            user.get('/races')
                .end((err, res) => {
                    res.text.should.not.contain( "<h1>Races Aanmaken</h1>");
                    expect(res).to.be.html;
                    done();
                });
        });
        describe("getlocation", ()=> {
            it("send incorrect details",(done)=> {
                admin.get('/races')
                    .set('Accept', 'application/json')
                    .send('adress=Onderwijsboulevard 5223 5223 DJ \'s-Hertogenbosch')
                    .send('meters=200')
                    .end((err, res) => {
                        res.text.should.contain( "");
                        expect(res).to.be.json;
                        done();
                    });
            });
            it("send correct details",(done)=> {
                admin.post('/races/location')
                    .set('Accept', 'application/json')
                    .send('adress='+encodeURI('Onderwijsboulevard 5223 5223DJ \'s-Hertogenbosch'))
                    .send('meters=200')
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end((err, res) => {
                        res.text.should.contain( "Paleis Den Bosch");
                        expect(res).to.be.json;
                        done();
                    });
            });
        });
        describe("getAll races", ()=> {
            it("json show user races",(done)=> {
                user.get('/races')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(JSON.parse(res.text).length).to.equal(1);
                        expect(res).to.be.json;
                        done();
                    });
            });
            it("json show admin races",(done)=> {
                admin.get('/races')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(JSON.parse(res.text).length).to.equal(2);
                        expect(res).to.be.json;
                        done();
                    });
            });
            it("html show all races",(done)=> {
                admin.get('/races')
                    .end((err, res) => {
                        res.text.should.contain( "Race den bosch");
                        expect(res).to.be.html;
                        res.text.should.contain( "Arnhem bierdag");
                        done();
                    });
            });
        });
        describe("get one races", ()=> {
            it("json show one races",(done)=> {
                admin.get('/races/'+"Race den bosch")
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        res.text.should.contain( "Race den bosch");
                        expect(res).to.be.json;
                        res.text.should.not.contain( "Arnhem bierdag");
                        done();
                    });
            });
            it("html show one races",(done)=> {
                admin.get('/races/'+"Race den bosch")
                    .end((err, res) => {
                        res.text.should.contain( "Race den bosch");
                        expect(res).to.be.html;
                        res.text.should.not.contain( "Arnhem bierdag");
                        done();
                    });
            });
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
        it("does not get waypoint page html page",(done)=> {
            chai.request(app).get('/waypoints')
                .end((err, res) => {
                    res.text.should.contain("<div class=\"card-header\">Login</div>");
                    done();
                });
        });
    });
    describe("user can do", ()=>{
        it("can not go to create waypoints",(done)=> {
            user.get('/races/waypoints')
                .end((err, res) => {
                    res.text.should.not.contain( "<h1>Waypoint Aanmaken</h1>");
                    expect(res).to.be.html;
                    done();
                });
        });
        describe("check", ()=> {
            it("send incorrect details");
            it("send correct details");
        });
        describe("get one races", ()=> {
            it("json show one races");
            it("html show one races");
        });
        describe("location", ()=> {
            it("send incorrect details",(done)=> {
                admin.get('/races/waypoints/location')
                    .set('Accept', 'application/json')
                    .send('adress=Onderwijsboulevard 5223 5223 DJ \'s-Hertogenbosch')
                    .send('meters=200')
                    .end((err, res) => {
                        res.text.should.contain( "");
                        expect(res).to.be.json;
                        done();
                    });
                });
                // it("send correct details",(done)=> {
                //     admin.post('/races/waypoints/location')
                //         .set('Accept', 'application/json')
                //         .send('adress='+encodeURI('Onderwijsboulevard 5223 5223DJ \'s-Hertogenbosch'))
                //         .send('meters=200')
                //         .set('Content-Type', 'application/x-www-form-urlencoded')
                //         .end((err, res) => {
                //             res.text.should.contain( "Paleis Den Bosch");
                //             expect(res).to.be.json;
                //             done();
                //         });
                // });       
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
