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
        if (internshipPost.company_logo){
            unlinkOldFiles(internshipPost.company_logo);
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

// router.get('/delete', function (req, res, next) {
//     db.InternshipPost.findByPk(req.query.id, {
//         attributes: ["company_logo", "post_document"]
//     }).then(result => {
//         //når vi kalder noget r, f.eks. rtitle eller remail er det for at refere til resultat så der principelt set kommer til at stå "result email"
//         unlinkOldFiles(result["post_document"])
//         unlinkOldFiles(result["company_logo"])
//         deleteFromDb()
//     }).catch();
//     function deleteFromDb() {
//         db.InternshipPost.destroy({
//             where: {
//                 id: req.query.id
//             }
//         })
//         res.render('internship_update', {
//             title: 'Express'
//         });
//     }
// });

module.exports = { deleteInternshipPost }