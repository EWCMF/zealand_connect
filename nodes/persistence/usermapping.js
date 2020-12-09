const models = require("../models");

async function findUserByEmail(email) {
    let user = null;
    return new Promise(resolve => {
        console.log("---finding user by email: " + email + "---");
        models.Student.findOne({
            nest: true,
            where: {email: email},
            include: {
                model: models.CV,
                as: 'cv'
        }}).then((student) => {
            if (student === null) {
                console.log('en student med denne email findes ikke!');
            }
            if (student instanceof models.Student) {
                console.log("---fandt en Student med mailen:---");
                //console.log(user instanceof models.User); // true
                //console.log(user.username); // 'My Title'
                user = student
            }
        }).then(() => {
            models.Virksomhed.findOne({where: {email: email}}).then((virksomhed) => {
                if (virksomhed === null) {
                    console.log('en virksomhed med denne email findes ikke!');
                    //resolve(null);
                }
                if (virksomhed instanceof models.Virksomhed) {
                    console.log("---fandt en Virksomhed med mailen:---");
                    //console.log(user instanceof models.User); // true
                    //console.log(user.username); // 'My Title'
                    user = virksomhed;
                }
                resolve(user);
            });
        })
    })
}

async function editVirksomhed(email, cvrnr, navn, adresse, tlfnr, hjemmeside, direktoer, land, postnr, by){
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

async function deleteVirksomhed(email) {
    try {
        await models.Virksomhed.destroy({
            where: {
                email: email
            }
        });
        console.log("A virksomhed was deleted")
    } catch (e) {
        console.log(e);
    }
}

async function deleteStudent(email) {
    try {
        await models.Student.destroy({
            where: {
                email: email
            }
        });
        console.log("A student was deleted")
    } catch (e) {
        console.log(e);
    }
}

async function findUserByCVR(CVR) {
    let user = null;
    return new Promise(resolve => {
        console.log("---finding user by CVR: " + CVR + "---");
        models.Virksomhed.findOne({where: {cvrnr: CVR}}).then((virksomhed) => {
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
        console.log(fornavn, efternavn, telefon, profilbillede);
    })
}




module.exports = {
    findUserByEmail: findUserByEmail, createVirksomhed: createVirksomhed, deleteVirksomhed: deleteVirksomhed,
    editVirksomhed: editVirksomhed, findUserByCVR: findUserByCVR, editStudent: editStudent, deleteStudent: deleteStudent
}
