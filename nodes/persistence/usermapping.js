const models = require("../models");
const deleteInternshipPost = require('../persistence/internship_post_mapping').deleteInternshipPost;
const deleteCV = require('../persistence/cv-mapping').deleteCV;
const hashPassword = require('../encryption/password').hashPassword;
const unlinkOldFiles = require("../utils/file-handling").unlinkOldFiles;

async function findUserByEmail(email) {
    let user = null;
    if (email == undefined) {
        return user;
    }
    //denne metode prøver først at se om en student matcher email, så bagefter virksomhed.
    return new Promise(resolve => {
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
                return;
            }
            if (student instanceof models.Student) {
                user = student
            }
        }).then(() => {
            models.Virksomhed.findOne({where: {email: email}}).then((virksomhed) => {
                if (virksomhed === null) {
                    return;
                }
                if (virksomhed instanceof models.Virksomhed) {
                    user = virksomhed;
                }
            }).then(() => {
                models.Admin.findOne({where: {username: email}}).then((admin) => {
                    if (admin === null) {
                        resolve(user);
                    }
                    if (admin instanceof models.Admin) {
                        user = admin;
                    }
                    resolve(user);
                })
            });
        })
    })
}

async function findVirksomhedByCvr(cvr) {
    let user = await models.Virksomhed.findOne({
        where: {
            cvrnr: cvr
        }
    })

    return user;
}

async function editVirksomhed(json) {
    json.visibleMail == 'on' ? json.visibleMail = true : json.visibleMail = false;

    let virksomhed = await models.Virksomhed.findOne({ where: {email: json.email}});
    virksomhed.update({
        cvrnr: json.cvrnr,
        navn: json.navn,
        adresse: json.adresse,
        tlfnr: json.tlfnr,
        hjemmeside: json.hjemmeside,
        land: json.land,
        postnr: json.postnr,
        by: json.by,
        logo: json.logo,
        visible_mail: json.visibleMail,
        description: json.description
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
                visible: true,
                user_data_consent: virkObj.user_data_consent
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
            foedselsdato: studentObj.foedselsdato,
            user_data_consent: studentObj.user_data_consent
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
        if (virksomhed == null) {
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

        if (virksomhed.logo) {
            unlinkOldFiles(virksomhed.logo)
        }

        //slet virksomheden
        await virksomhed.destroy();
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}

// Note: this function is used in a cron job. Changes here will apply to the cron job as well.
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
        } else {
            //slet studentens cv hvis det findes
            if (student.cv != null) {
                deleteCV(student.cv.id);
            }

            if (student.profilbillede) {
                unlinkOldFiles(student.profilbillede)
            }

            //slet studenten
            await student.destroy();
            return errorHappened;
        }
    } catch (e) {
        console.log(e);
    }
}

async function findUserByCVR(CVR) {
    let user = null;
    return new Promise(resolve => {
        models.Virksomhed.findOne({where: {cvrnr: CVR}}).then((virksomhed) => {
            if (virksomhed === null) {
                //resolve(null);
            }
            if (virksomhed instanceof models.Virksomhed) {
                user = virksomhed;
            }
            resolve(user);
        });
    })
}

async function editStudent(email, fornavn, efternavn, telefon, profilbillede) {
    let student = await models.findOne({ where: {email: email}});
    student.update({
        fornavn: fornavn,
        efternavn: efternavn,
        tlfnr: telefon,
        profilbillede: profilbillede
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

async function editProfilePic(email, profilbillede) {
    findUserByEmail(email).then(student => {
        student.update({
            profilbillede: profilbillede
        });
    })
}

function searchVirksomhederByName(name) {
    const {Op} = require('sequelize');

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

function findStudentByName(name) {
    const {Op} = require('sequelize');

    return models.Student.findAll({
        raw: true,
        limit: 10,
        where: {
            [Op.or]: {
                fornavn: {
                    [Op.like]: "%" + name + "%"
                },
                efternavn: {
                    [Op.like]: "%" + name + "%"
                }
            }
        },
    });
}

module.exports = {
    findUserByEmail, createVirksomhed, deleteVirksomhed, editVirksomhed, findUserByCVR, editStudent, deleteStudent,
    editProfilePic, createStudent, editPassword, searchVirksomhederByName, findStudentByName, findVirksomhedByCvr
}
