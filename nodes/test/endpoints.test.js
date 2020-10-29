const request = require('supertest');
const express = require('express');
const app = require('../app');
const chai = require('chai');


/*describe('GET /', function() {
    it('respond with hello world', function(done) {
    //navigate to root and check the the response is "hello world"
    request(app).get('/').expect('hello world', done);
    });
});*/

describe('GET /users', function () {
    it('respond with status code OK 200', function(done) {
        request(app).get('/users').expect(200, done);
    })
});