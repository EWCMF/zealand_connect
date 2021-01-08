const models = require("../models");

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
                as: 'cv'
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

async function editVirksomhed(email, cvrnr, navn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by) {
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
            by: by
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
                postnr: virkObj.postnr
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
        //find nu alle de internshipposts som har den foreign key virksomhed_id som passer til den id
        //denne kode kan optimeres hvis man laver en assosiation og så bare tilføjer det til include oven over
        var internshipPosts = await models.InternshipPost.findAll({
            where: {
                virksomhed_id: virksomhed.id
            }
        });
        //iterate internship posts and delete
        for (let i = 0; i < internshipPosts.length; i++) {
            await internshipPosts[i].destroy();
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

async function editProfilePic(email, profilbillede){
    findUserByEmail(email).then(student => {
        student.update({
            profilbillede: profilbillede
        });
    })
}

module.exports = {
    findUserByEmail: findUserByEmail, createVirksomhed: createVirksomhed, deleteVirksomhed: deleteVirksomhed,
    editVirksomhed: editVirksomhed, findUserByCVR: findUserByCVR, editStudent: editStudent, deleteStudent: deleteStudent,
    editProfilePic: editProfilePic, createStudent: createStudent
}
