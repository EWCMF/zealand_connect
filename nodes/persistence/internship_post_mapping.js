const models = require("../models");

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

        }

        //slet virksomheden
        await internshipPost.destroy();
        console.log("A internship post was deleted");
        return errorHappened;
    } catch (e) {
        console.log(e);
    }
}