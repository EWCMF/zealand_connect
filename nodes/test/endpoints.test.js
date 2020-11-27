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
    it('respond with status code OK 200', (done) => {
        let virksomhed = {
            email: "test@test.dk",
            gentagEmail: "test@test.dk",
            password: "12345678",
            gentagPassword: "12345678",
            telefonnummer: "12345678",
            by: "Testby",
            postnummer: "0000",
            cvr: "66666666"
        }
        chai.request(app)
            .post('/opret-bruger/create')
            .send(virksomhed)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.html;
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('POST /opret-bruger/create', () => {
    it('the html should contain errors', (done) => {
        let virksomhed = {
            email: "3wty4e",
            gentagEmail: "wegy45u4",
            password: "1234",
            gentagPassword: "921jgre",
            telefonnummer: "23ty35u",
            by: "h434",
            postnummer: "f43y",
            cvr: "f4ey56"
        }
        chai.request(app)
            .post('/opret-bruger/create')
            .send(virksomhed)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.include("Fejl ved oprettelse af bruger");
                expect(res.text).to.include("Email findes allerede i systemet");
                expect(res.text).to.include("Adgangskode skal være mellem 8 og 16 tegn");
                expect(res.text).to.include("Telefonnummer er ugyldigt");
                expect(res.text).to.include("By er ugyldig");
                expect(res.text).to.include("CVR-nummer er ugyldigt");
                done();
            });
    });
});

describe('POST /opret-bruger/create', () => {
    it('it should meme', (done) => {
        let virksomhed = {
            email: "3wty4e",
            gentagEmail: "wegy45u4",
            password: "1234",
            gentagPassword: "921jgre",
            telefonnummer: "23ty35u",
            by: "h434",
            postnummer: "f43y",
            cvr: "f4ey56"
        }
        chai.request(app)
            .post('/opret-bruger/create')
            .send(virksomhed)
            .end((err, res) => {
                expect(res).to.have.status(200);
                console.log(res.header);
                expect(res).to.have.cookie('sessionid');
                done();
            });
    });
});
