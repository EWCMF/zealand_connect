const express = require('express');
const router = express.Router();
const models = require('../models');
const {reqLang} = require('../public/javascript/request');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/posts', authorizeUser('student'), async function (req, res) {
    const userId = res.locals.user.id;

    // Find list elements (posts)
    const favouritePosts = await models.FavouritePost.findAll({
        raw: true,
        where: {
            student_id: userId
        },
        visible: true,
        attributes: ['internship_post_id']
    })

    let postIds = [];
    favouritePosts.forEach(post => {
        postIds.push(post.internship_post_id)
    });

    const rows = await models.InternshipPost.findAll({
        raw: true,
        nest: true,
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            id: postIds
        },
        include: [
            {
                model: models.Virksomhed,
                as: 'virksomhed'
            },
            {
                model: models.Uddannelse,
                attributes: ['name']
            }
        ],
    });


    // Manipulate the array to contain the information we want
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        let formatDate = new Date(element['updatedAt']);
        let leadingZeroDay = formatDate.getDate() < 10 ? '0' : '';
        let leadingZeroMonth = (formatDate.getMonth() + 1) < 10 ? '0' : '';

        let newDate = leadingZeroDay + formatDate.getDate() + "/" + leadingZeroMonth + (formatDate.getMonth() + 1) + "/" + formatDate.getFullYear();
        element.formattedDate = newDate;

        if (element['post_start_date'].length > 0) {
            let cropStart = element['post_start_date'].substring(0, 10);

            let startYear = cropStart.substring(0, cropStart.indexOf('-'));
            let startMonth = cropStart.substring(cropStart.indexOf('-') + 1, cropStart.lastIndexOf('-'));
            let startDay = cropStart.substring(cropStart.lastIndexOf('-') + 1);

            element['post_start_date'] = startDay + '/' + startMonth + '/' + startYear;
        }

        if (element['post_end_date'] != null && element['post_end_date'].length > 0) {
            let cropEnd = element['post_end_date'].substring(0, 10);

            let endYear = cropEnd.substring(0, cropEnd.indexOf('-'));
            let endMonth = cropEnd.substring(cropEnd.indexOf('-') + 1, cropEnd.lastIndexOf('-'));
            let endDay = cropEnd.substring(cropEnd.lastIndexOf('-') + 1);
            element['post_end_date'] = endDay + '/' + endMonth + '/' + endYear;
        }

        switch (element['post_type']) {
            case 1:
                element['post_type'] = 'Praktik';
                break;
            case 2:
                element['post_type'] = 'Studiejob';
                break;
            case 3:
                element['post_type'] = 'Trainee stilling';
                break;
            case 4:
                element['post_type'] = 'Fuldtidsstilling';
        }

        favouritePosts.forEach(favouritePost => {
            if (favouritePost.internship_post_id === element.id) {
                element['isFavourite'] = true;
            }
        });
    }

    // Render the view and send the array of objects
    res.render('my-favourite-internship-posts', {
        language: reqLang(req, res),
        json: rows
    });
})

router.get('/cvs', authorizeUser('company'), async function (req, res) {
    const userId = res.locals.user.id;

    // Find list elements (cvs)
    const favouriteCVs = await models.FavouriteCV.findAll({
        raw: true,
        where: {
            company_id: userId
        },
        attributes: ['cv_id']
    })

    let cvIds = [];
    favouriteCVs.forEach(cv => {
        cvIds.push(cv.cv_id)
    });

    let rows = await models.CV.findAll({
        raw: false,
        nest: true,
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            id: cvIds
        },
        include: [
            {
                model: models.Student,
                as: 'student'
            }, {
                model: models.Uddannelse,
                as: 'education',
                attributes: ['name']
            },
            {
                model: models.CVtype,
                as: 'cvtype',
                attributes: ['cvtype'],
                through: models.CV_CVtype
            }
        ],
    })

    rows = rows.map(cv => {
        let formatDate = new Date(cv.updatedAt);
        let leadingZeroDay = formatDate.getDate() < 10 ? '0' : '';
        let leadingZeroMonth = (formatDate.getMonth() + 1) < 10 ? '0' : '';

        let updatedAt = leadingZeroDay + formatDate.getDate() + "/" + leadingZeroMonth + (formatDate.getMonth() + 1) + "/" + formatDate.getFullYear();

        return {
            id: cv.id,
            overskrift: cv.overskrift,
            om_mig: cv.om_mig,
            student: {
                fornavn: cv.student.fornavn,
                efternavn: cv.student.efternavn,
                profilbillede: cv.student.profilbillede
            },
            education: {
                name: cv.education.name
            },
            cvtype: cv.cvtype.map(cvtype => {
                return {
                    cvtype: cvtype.dataValues.cvtype
                }
            }),
            formattedDate: updatedAt
        }
    });

    rows.forEach(cv => {
        favouriteCVs.forEach(favouriteCV => {
            if (favouriteCV.cv_id === cv.id) {
                cv['isFavourite'] = true;
            }
        })
    })

    // Render the view and send the array of objects
    res.render('my-favourite-cvs', {
        language: reqLang(req, res),
        json: rows
    });
})

router.post('/mark-post-as-favourite', authorizeUser('student'), async function (req, res) {
    let postId = Number(req.body)
    let studentId = res.locals.user.id;

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

    if (!created) {
        await favourite.destroy()
        return res.send(false)
    }

    return res.send(true)
})

router.post('/mark-cv-as-favourite', authorizeUser('company'), async function (req, res) {
    let cvId = Number(req.body)
    let companyId = res.locals.user.id;

    const [favourite, created] = await models.FavouriteCV.findOrCreate({
        where: {
            company_id: companyId,
            cv_id: cvId
        },
        defaults: {
            company_id: companyId,
            cv_id: cvId
        }
    });

    if (!created) {
        await favourite.destroy()
        return res.send(false)
    }

    return res.send(true)
})

module.exports = router;