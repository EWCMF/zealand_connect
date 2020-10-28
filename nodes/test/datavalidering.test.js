var assert=require('assert');
var expect = require('chai').expect

describe('email', function() {
   it ('skal være gyldig email', function(){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    expect(regex.test('test@test.dk')).to.be.true 
   });
   it ('skal være ugyldig email - text før @', function(){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    expect(regex.test('@test.dk')).to.be.false 
   });
   it ('skal være ugyldig email - text mellem @ og top domæne', function(){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    expect(regex.test('test@.dk')).to.be.false 
   });
   it ('skal være ugyldig email - mangler @', function(){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    expect(regex.test('test.dk')).to.be.false 
   });
});
