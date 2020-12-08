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

//Regex brugt til CVR validering på praktikopslag.
describe('CVR test', function () {
    it('kun tal', function () {
        const regex = /^[0-9]{8}$/;
        expect(regex.test('87654321')).to.be.true;
    });
    it('kun tal', function () {
        const regex = /^[0-9]{8}$/;
        expect(regex.test('0123456789abcdefghijklmnopqwurstuvxyzæøå')).to.be.false;
    });
});

//Regex brugt til dato validering på praktikopslag.
describe('Date test', function () {
    it('gyldig dato', function () {
        const regex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
        expect(regex.test('2020-10-10')).to.be.true;
    });
    it('ugyldig dato', function () {
        const regex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
        expect(regex.test('2k20-10-10')).to.be.false;
    });
});

//Regex brugt til link validering på praktikopslag.
describe('URI test', function () {
    it('gyldig link', function () {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        expect(regex.test('https://www.connect.zealand.dk')).to.be.true;
    });
    it('gyldig link', function () {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        expect(regex.test('https://connect.zealand.dk')).to.be.true;
    });
    it('gyldig link', function () {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        expect(regex.test('www.connect.zealand.dk')).to.be.true;
    });
    it('gyldig link', function () {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        expect(regex.test('connect.zealand.dk')).to.be.true;
    });
    it('gyldig link', function () {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        expect(regex.test('https://www.connect.zealand.dk/login')).to.be.true;
    });
    it('ugyldig link', function () {
        const regex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
        expect(regex.test('zealand/connect')).to.be.false;
    });
});
