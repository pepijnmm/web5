var request = require('supertest')
    , express = require('express');

var app = require('../app').app;

describe('login Page', function() {
    it("go to login page", function(done) {
        request(app).get('/login').expect(200, done);
    })
})
describe('redirects Page', function() {
    it("redirect to login page", function(done) {
        request(app).get('/').redirects(1).end((err,res)=>{
            console.log(res.redirect);
            res.should.redirectTo('/login')
        });
    })
})
