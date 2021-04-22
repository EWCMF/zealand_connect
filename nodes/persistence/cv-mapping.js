const models = require("../models");

async function deleteCV(id) {
    let errorHappened = false;
    try {
        //find CV
        let CV = await models.CV.findOne({
            where: {
                id: id
            }
        });
        if(CV == null){
            errorHappened = true;
            return errorHappened;
        }

        // Slet favourite associations
        await models.FavouriteCV.destroy({
            where: {
                cv_id: id
            }
        })

        //slet CV'et
        await CV.destroy();
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { deleteCV }