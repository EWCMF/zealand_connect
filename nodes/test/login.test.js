var assert = require('assert');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
const verifyPassword = require('../encryption/password').verifyPassword;

describe('Find student i database baseret på email', function(){
    //TC1
    it('Bør find en bruger med username som matcher det username vi indtaster, i student tabellene', function(done){
        let email = 'bob@gmail.com';
        findUserByEmail(email).then((student)=>{
            assert.strictEqual(student.email, email);
            done();
        })
    })
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
    it('Bør find en Virksomheds bruger med email som matcher det username vi indtaster', function(done){
        let email = 'kontakt@bigfoods.dk';
        findUserByEmail(email).then((virksomhed)=>{
            assert.strictEqual(virksomhed.email, email);
            done();
        })
    })
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