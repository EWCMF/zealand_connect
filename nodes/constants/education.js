const db = require('../models');

async function getAllEducation(req) {
    let udd;
    if (req.cookies.lang == 'en') {
        udd = await db.Uddannelse.findAll({
            attributes: ['id', ['english_name', 'name']],
            order: [
                ['name', 'ASC']
            ]
        });
    } else {
        udd = await db.Uddannelse.findAll({
            attributes: ['id', 'name'],
            order: [
                ['name', 'ASC']
            ]
        });
    }
    return udd;
}

function includeEducation(req) {
    let uddInclude;
    if (req.cookies.lang == 'en') {
        uddInclude = {
            model: db.Uddannelse,
            as: 'education',
            attributes: [['english_name', 'name']]
        }
    } else {
        uddInclude = {
            model: db.Uddannelse,
            as: 'education',
            attributes: ['name']
        }
    }
    return uddInclude;
}

module.exports = { getAllEducation, includeEducation }