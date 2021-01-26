var assert = require('assert');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const createStudent = require('../persistence/usermapping').createStudent;
const createVirksomhed = require('../persistence/usermapping').createVirksomhed;
const verifyPassword = require('../encryption/password').verifyPassword;
const { sequelize } = require('../models');

before(function() {
    sequelize.sync();
});

describe('Find student i database baseret på email', function(){
    this.timeout(5000);

    //TC1
    it('Bør find en bruger med username som matcher det username vi indtaster, i student tabellene', async function(){
        let email = "bob@gmail.com"
        
        let studentJson = {
            email: email,
            tlfnr: null,
            password: null,
            fornavn: null,
            efternavn: null,
            foedselsdato: null
        }
        await createStudent(studentJson);

        let student = await findUserByEmail(email);
        assert.strictEqual(student.email, email);
    });

    //TC2
    it('Bør ikke være i stand til at finde en student med en email der ikke er registreret i databasen', function(done){
        let email = 'enbrugerderikkefindesidatabasen@gmail.com';
        findUserByEmail(email).then((student)=>{
            assert.strictEqual(student, null);
            done();
        })
    })  
})

describe('Find bruger i database baseret på email', function(){
    //TC3
    it('Bør find en Virksomheds bruger med email som matcher det username vi indtaster', async function(){
        let email = 'kontakt@bigfoods.dk';
        let virksomhedJson = {
            email: email,
            tlfnr: null,
            password: null,
            cvrnr: null,
            by: null,
            postnr: null
        }
        await createVirksomhed(virksomhedJson);
        let virksomhed = await findUserByEmail(email);
        assert.strictEqual(virksomhed.email, email);
    });
    //TC4
    it('bør ikke find en Virksomheds bruger med email  der ikke er registreret i databasen', function(done){
        let email = 'enbrugerderikkefindesidatabasen@gmail.com';
        findUserByEmail(email).then((user)=>{
            assert.strictEqual(user, null);
            done();
        })
    })  
})

describe('Check om 2 password er ens', function(){
    //TC7
    it('Bør være true, da vi har på forhånd hashed passworded', function(done){
        let htmlPwd = 'asdfg';
        let hashedPwd = '$2b$10$RZMS0Th.ntmF7xuaUYmARO8AZdpX6PpmUWgmeR0DsnMXqtS8gE7.G'
        verifyPassword(htmlPwd, hashedPwd).then((match)=>{
            assert.strictEqual(true, match);
            done();
        })
    })
    //TC8
    it('Bør være false, da hashen er forkert', function(done){
        let htmlPwd = 'asdfg';
        let hashedPwd = 'NOTHASHGOODBAD!??###'
        verifyPassword(htmlPwd, hashedPwd).then((match)=>{
            assert.strictEqual(false, match);
            done();
        })
    })
})