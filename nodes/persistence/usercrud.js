const models = require("../models");

async function createVirksomhed(virkObj){
    try {
        const virksomhed = await models.Virksomhed.create({email: virkObj.email, tlfnr: virkObj.tlfnr, password: virkObj.password, cvrnr: virkObj.cvrnr});
        console.log("A virksomhed was created");
        console.log(virksomhed instanceof models.Virksomhed);
        console.log(virksomhed.email);
    } catch (e) {
        console.log(e);
    }
}

async function deleteVirksomhed(email){
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

module.exports = {createVirksomhed: createVirksomhed, deleteVirksomhed: deleteVirksomhed}
