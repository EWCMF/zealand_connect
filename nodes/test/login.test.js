var assert = require('assert');
const findUserByEmail = require('../persistence/usermapping').findUserByEmail;
// const findUserById = require('../persistence/usermapping').findUserById;
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


/*
 describe('Find bruger i database baseret på id', function(){
    //TC5
    it('Bør ikke kunne finde en bruger hvis ingen bruger med denne id findes', function(done){
        let id = -1;
        findUserById(id).then((user)=>{
            assert.strictEqual(user, null);
            done();
        })
    })
    //TC6
    it('Bør find en bruger med id som matcher det id vi indtaster', function(done){
        let id = 1;
        findUserById(id).then((user)=>{
            assert.strictEqual(user.id, id);
            done();
        })
    })
})
*/


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

/*

describe('Opret en googlebruger i systemet og så check at den eksisterer', function(){
    it('Bør oprette google bruger og kunne finde brugeren baseret på username', function(done){
        let username = 'benny';
        let googleID = 69420;
        createGoogleUser(username, googleID).then(()=>{
            findUserByName(username).then((user)=>{
                assert.strictEqual(user.username, username);
                done();
            })
        });
    })
    
    it('Bør oprette zealand bruger og kunne finde brugeren baseret på username', function(done){
        let username = 'benny';
        let password = 'blabla123';
        createZealandUser(username, password).then(()=>{
            findUserByName(username).then((user)=>{
                assert.strictEqual(user.username, username);
                done();
            }) 
        })
    }) 
})*/ 