var expect = require('chai').expect

describe('email', function () {
    it('skal være gyldig email', function () {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
        expect(regex.test('test@test.dk')).to.be.true;
    });
    it('skal være ugyldig email - text før @', function () {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
        expect(regex.test('@test.dk')).to.be.false;
    });
    it('skal være ugyldig email - text mellem @ og top domæne', function () {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
        expect(regex.test('test@.dk')).to.be.false;
    });
    it('skal være ugyldig email - mangler @', function () {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
        expect(regex.test('test.dk')).to.be.false;
    });
});

describe('letters only', function () {
    it('kun bogstaver', function () {
        const regex = /^[A-Za-zÆØÅæøå]+$/;
        expect(regex.test('ABCDEFGHIJKLMNOPQWRSTUVXYZÆÆØÅabcdefghijklmnopqwrstuvxyzæøå')).to.be.true;
    });
    it('kun bogstaver', function () {
        const regex = /^[A-Za-zÆØÅæøå]+$/;
        expect(regex.test('ABCDEFGHIJKLMNOPQWRSTUVXYZÆÆØÅabcdefghijklmnopqwrstuvxyzæøå012345678910')).to.be.false;
    });
});

describe('number only', function () {
    it('kun tal', function () {
        const regex = /^[0-9]+$/;
        expect(regex.test('0123456789')).to.be.true;
    });
    it('kun tal', function () {
        const regex = /^[0-9]+$/;
        expect(regex.test('0123456789abcdefghijklmnopqwurstuvxyzæøå')).to.be.false;
    });
});