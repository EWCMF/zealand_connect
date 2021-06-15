const models = require("../models");

async function deleteCV(id) {
    try {
        //find CV
        let CV = await models.CV.findOne({
            where: {
                id: id
            }
        });
        if(CV == null){
            return;
        }

        // Slet favourite associations
        models.FavouriteCV.destroy({
            where: {
                cv_id: id
            }
        });

        // Slet CV type associations
        models.CV_CVtype.destroy({
            where: {
                cv_id: id
            }
        });

        //slet CV'et
        CV.destroy();
    } catch (e) {
        console.log(e);
    }
}

async function deleteProCV(id) {
    try {
        //find professor CV
        let CV = await models.ProfessorCV.findOne({
            where: {
                id: id
            }
        });
        if(CV == null){
            return;
        }

        //slet CV'et
        CV.destroy();
    } catch (e) {
        console.log(e);
    }
}

module.exports = { deleteCV, deleteProCV }