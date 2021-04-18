const express = require('express');
const router = express.Router();
const models = require('../models');
const { reqLang } = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.post('/favourite-post', authorizeUser('student'), async function (req, res){
    let postId = Number(req.body)
    let studentId = res.locals.user.id;

    console.log(postId)

    const [favourite, created] = await models.FavouritePost.findOrCreate({
        where: {
            student_id: studentId,
            internship_post_id: postId
        },
        defaults: {
            student_id: studentId,
            internship_post_id: postId
        }
    });

    if (!created){
        await favourite.destroy()
        return res.send(false)
    }

    return res.send(true)
})

module.exports = router;