const express = require('express');
const router = express.Router();
const uploadFolder = require('../constants/references').uploadFolder();
const path = require('path');

router.get('/:name', function(req, res, next){
    let param = req.params.name;
    let filePath = path.normalize(uploadFolder + param);
    let fileName = param.replace(/^.*_/, "")

    res.download(filePath, fileName);
});

module.exports = router;
