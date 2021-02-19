const express = require('express');
const router = express.Router();
const {reqLang} = require('../public/javascript/request');
const Models = require('../models');
const authorizeUser = require("../middlewares/authorizeUser").authorizeUser;

router.get('/', async function (req, res, next) {
    const newsPosts = await Models.NewsPost.findAll({
        raw: true
    });

    res.render('news', {language: reqLang(req, res), json: newsPosts});
});

router.get('/new-post', authorizeUser('admin'), async function (req, res, next) {
    let update;
    let newsPost;

    if (req.query.id) {
        let id = req.query.id;
        update = true;
        newsPost = await Models.NewsPost.findByPk(id);
    }
    res.render('news_post', {language: reqLang(req, res), newsPost: newsPost, update: update});
});

router.post('/new-post', authorizeUser('admin'), async function (req, res, next) {
    let id = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let date = new Date();
    let formattedDate = ('0' + date.getDate()).slice(-2) + '-'
        + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
        + date.getFullYear();

    let json = {
        "id": id,
        "title": title,
        "content": content,
        "date": formattedDate
    }

    if (id) {
        await Models.NewsPost.update(json, {
            where: {
                id: id
            }
        })
    } else {
        await Models.NewsPost.create(json)
    }

    res.redirect('/news');
});

router.get('/delete-post/:id', authorizeUser('admin'), async function (req, res, next) {
    let id = req.params.id;
    await Models.NewsPost.destroy({
        where: {
            id: id
        }
    })
    res.redirect('/news');
});


module.exports = router;
