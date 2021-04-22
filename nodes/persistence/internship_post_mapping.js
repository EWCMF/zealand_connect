const models = require("../models");
const unlinkOldFiles = require("../utils/file-handling").unlinkOldFiles;

async function deleteInternshipPost(id) {
    let errorHappened = false;
    try {
        //find internship post
        let internshipPost = await models.InternshipPost.findOne({
            where: {
                id: id
            }
        });
        if(internshipPost == null){
            errorHappened = true;
            return errorHappened;
        }

        // Slet favourite associations
        await models.FavouritePost.destroy({
            where: {
                internship_post_id: id
            }
        })

        // Slet filer tilknyttet opslaget
        if (internshipPost.post_document){
            unlinkOldFiles(internshipPost.post_document)
        }
        
        //slet praktikopslaget
        await internshipPost.destroy();
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { deleteInternshipPost }