const models = require("../models");
const unlinkOldFiles = require("../utils/file-handling").unlinkOldFiles;

async function deleteInternshipPost(id) {
    let errorHappened = false;
    try {
        //find internship post
        var internshipPost = await models.InternshipPost.findOne({
            where: {
                id: id
            }
        });
        if(internshipPost == null){
            errorHappened = true;
            return errorHappened;
        }

        if (internshipPost.post_document){
            unlinkOldFiles(internshipPost.post_document)
        }

        //TODO: håndter virksomhedslogo

        //slet praktikopslaget
        await internshipPost.destroy();
        console.log("An internship post was deleted");
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { deleteInternshipPost }