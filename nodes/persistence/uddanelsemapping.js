const models = require("../models");

async function createUddanelse(nameobj) {
  try {
    await models.Uddannelse.create({
      name: nameobj,
    });
    return "uddannelseOprettet";
  } catch (e) {
    console.log(e);
  }
}

async function findUddannelseByName(name) {
  let udd = null;
  return new Promise((resolve) => {
    models.Uddannelse.findOne({
      where: { name: name },
    }).then((uddannelse) => {
      if (uddannelse === null) {
      }
      if (uddannelse instanceof models.Uddannelse) {
        udd = uddannelse;
      }
      resolve(udd);
    });
  });
}
async function sletUddannelse(name) {
  try {
    await models.Uddannelse.destroy({
      where: {
        name: name,
      },
    });
    return "Uddannelse blev slettet"
  } catch (error) {
    console.log(error);
  }
} 

module.exports = {
  createUddanelse: createUddanelse,
  findUddannelseByName: findUddannelseByName,
  sletUddannelse: sletUddannelse,
};
