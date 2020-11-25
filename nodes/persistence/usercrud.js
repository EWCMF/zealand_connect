const models = require("../models");

async function createVirksomhed(virkObj){
    try {
        const virksomhed = await models.Virksomhed.create({email: virkObj.email, tlfnr: virkObj.tlfnr, password: virkObj.password, cvrnr: virkObj.cvrnr, by: virkObj.by, postnr: virkObj.postnr});
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
