const request = require('supertest');
const express = require('express');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect

chai.use(chaiHttp);

/*describe('GET /', function() {
    it('respond with hello world', function(done) {
    //navigate to root and check the the response is "hello world"
    request(app).get('/').expect('hello world', done);
    });
});*/

describe('GET /users', function () {
    it('respond with status code OK 200', function (done) {
        request(app).get('/users').expect(200, done);
    })
});

describe('GET /mit-CV', function () {
    it('respond with status code Access denied 403', function(done) {
        request(app).get('/mit-cv').expect(403, done);
    })
});

// Denne er udkommenteret da den ellers bare ville lave tomme CV entries i databasen.
// describe('POST /mit-CV/submit', function () {
//     it('respond with status code OK 200', function(done) {
//         request(app).post('/mit-CV/submit').expect(200, done);
//     })
// });

describe('GET /login', function () {
    it('respond with status code OK 200', function (done) {
        request(app).get('/login').expect(200, done);
    })
});

describe('GET /opret-bruger', function () {
    it('respond with status code OK 200', function (done) {
        request(app).get('/opret-bruger').expect(200, done);
    })
});

describe('POST /opret-bruger/create', () => {
    it('it should meme', (done) => {
        let virksomhed = {
            email: "test@test.dk",
            gentagEmail: "test@test.dk",
            password: "12345678",
            gentagPassword: "12345678",
            telefonnummer: "12345678",
            by: "Testby",
            postnummer: "0000",
            cvr: "12345678"
        }
        chai.request(app)
            .post('/opret-bruger/create')
            .send(virksomhed)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

