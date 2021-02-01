const models = require("../models");
const deleteInternshipPost = require('../persistence/internship_post_mapping').deleteInternshipPost;
const hashPassword = require('../encryption/password').hashPassword;

async function findUserByEmail(email) {
    let user = null;
    if(email == undefined){
        return user;
    }
    //denne metode prøver først at se om en student matcher email, så bagefter virksomhed.
    return new Promise(resolve => {
        console.log("---finding user by email: " + email + "---");
        models.Student.findOne({
            nest: true,
            where: {email: email},
            include: {
                model: models.CV,
                as: 'cv',
                include: {
                    model: models.Uddannelse,
                    as: 'education',
                }
            }
        }).then((student) => {
            if (student === null) {
                console.log('en student med denne email findes ikke!');
            }
            if (student instanceof models.Student) {
                console.log("---fandt en Student med mailen:---");
                user = student
            }
        }).then(() => {
            models.Virksomhed.findOne({ where: { email: email } }).then((virksomhed) => {
                if (virksomhed === null) {
                    console.log('en virksomhed med denne email findes ikke!');
                }
                if (virksomhed instanceof models.Virksomhed) {
                    console.log("---fandt en Virksomhed med mailen:---");
                    user = virksomhed;
                }
            }).then(() => {
                models.Admin.findOne({ where: { username: email}}).then((admin)=>{
                    if (admin === null) {
                        console.log('en admin med denne email findes ikke!');
                    }
                    if(admin instanceof models.Admin){
                        console.log("---fandt en admin med mailen:---");
                        user = admin;
                    }
                    resolve(user);
                })
            });
        })
    })
}

async function editVirksomhed(email, cvrnr, navn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by, logo) {
    //vi bruger email til at finde virksomheden.
    findUserByEmail(email).then(virksomhed => {
        virksomhed.update({
            cvrnr: cvrnr,
            navn: navn,
            adresse: adresse,
            tlfnr: tlfnr,
            hjemmeside: hjemmeside,
            direktoer: direktoer,
            land: land,
            postnr: postnr,
            by: by,
            logo: logo
        })
    })
}

async function createVirksomhed(virkObj) {
    try {
        const virksomhed = await models.Virksomhed.create(
            {
                email: virkObj.email,
                tlfnr: virkObj.tlfnr,
                password: virkObj.password,
                cvrnr: virkObj.cvrnr,
                by: virkObj.by,
                postnr: virkObj.postnr,
                navn: virkObj.navn,
                visible: true
            }
        );
    } catch (e) {
        console.log(e);
    }
}

async function createStudent(studentObj) {
    try {
        await models.Student.create({
            email: studentObj.email,
            tlfnr: studentObj.tlfnr,
            password: studentObj.password,
            fornavn: studentObj.fornavn,
            efternavn: studentObj.efternavn,
            foedselsdato: studentObj.dato
        })
    } catch (error) {
        console.log(error);
    }
}


async function deleteVirksomhed(email) {
    let errorHappened = false;
    try {
        //find virksomhed
        var virksomhed = await models.Virksomhed.findOne({
            where: {
                email: email
            }
        });
        if(virksomhed == null){
            errorHappened = true;
            return errorHappened;
        }
        //find nu alle de internshipposts som har den foreign key fk_company som passer til den id
        //denne kode kan optimeres hvis man laver en assosiation og så bare tilføjer det til include oven over
        var internshipPosts = await models.InternshipPost.findAll({
            where: {
                fk_company: virksomhed.id
            }
        });
        //iterate internship posts and delete
        for (let i = 0; i < internshipPosts.length; i++) {
            deleteInternshipPost(internshipPosts[i].id);
        }
        //slet virksomheden
        await virksomhed.destroy();
        console.log("A virksomhed was deleted");
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}

async function deleteStudent(email) {
    var errorHappened = false;
    try {
        //find student, og den cv som han ejer (cv bliver null hvis han ikke har et)
        var student = await models.Student.findOne({
            include: [{
                model: models.CV,
                as: 'cv',
            }],
            where: {
                email: email,
            }
        });
        if (student == null) {
            errorHappened = true;
            return errorHappened;
        }
        else {
            //slet studentens cv hvis det findes
            if (student.cv != null) {
                await student.cv.destroy();
            }
            //slet studenten
            await student.destroy();
            console.log("A student was deleted");
            return errorHappened;
        }
    } catch (e) {
        console.log(e);
    }
}

async function findUserByCVR(CVR) {
    let user = null;
    return new Promise(resolve => {
        console.log("---finding user by CVR: " + CVR + "---");
        models.Virksomhed.findOne({ where: { cvrnr: CVR } }).then((virksomhed) => {
            if (virksomhed === null) {
                console.log('en virksomhed med dette CVR findes ikke!');
                //resolve(null);
            }
            if (virksomhed instanceof models.Virksomhed) {
                console.log("---i found the Virksomhed:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                user = virksomhed;
            }
            resolve(user);
        });
    })
}

async function editStudent(email, fornavn, efternavn, telefon, profilbillede) {
    findUserByEmail(email).then(student => {
        student.update({
            fornavn: fornavn,
            efternavn: efternavn,
            tlfnr: telefon,
            profilbillede: profilbillede
        });
    })
}

async function editPassword(email, password) {
    let hashedPassword = await hashPassword(password);
    findUserByEmail(email).then(user => {
        user.update({
            password: hashedPassword
        });
    })
}

async function editProfilePic(email, profilbillede){
    findUserByEmail(email).then(student => {
        student.update({
            profilbillede: profilbillede
        });
    })
}

function searchVirksomhederByName(name) {
    const { Op } = require('sequelize');

    return models.Virksomhed.findAll({
        raw: true,
        limit: 10,
        where: {
            navn: {
                [Op.like]: "%" + name + "%"
            }
        },
    });
}

module.exports = {
    findUserByEmail, createVirksomhed, deleteVirksomhed, editVirksomhed, findUserByCVR, editStudent, deleteStudent,
    editProfilePic, createStudent, editPassword, searchVirksomhederByName
}
