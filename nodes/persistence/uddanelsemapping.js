const models = require("../models");

async function createUddanelse(nameobj) {
  try {
    await models.Education.create({
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
    models.Education.findOne({
      where: { name: name },
    }).then((uddannelse) => {
      if (uddannelse === null) {
      }
      if (uddannelse instanceof models.Education) {
        udd = uddannelse;
      }
      resolve(udd);
    });
  });
}
async function sletUddannelse(name) {
  try {
    await models.Education.destroy({
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
