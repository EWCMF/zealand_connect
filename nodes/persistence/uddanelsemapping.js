const models = require("../models");

async function createUddanelse(nameobj) {
  try {
    await models.Uddannelser.create({
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
    console.log("--finding uddannelse by Name: " + name + "---");
    models.Uddannelser.findOne({
      where: { name: name },
    }).then((uddannelse) => {
      if (uddannelse === null) {
        console.log("en uddannelse med dette navn findes ikke!");
      }
      if (uddannelse instanceof models.Uddannelser) {
        console.log("--- fandt en uddannelse med navnet ---");
        udd = uddannelse;
      }
      resolve(udd);
    });
  });
}
/* mangler story
async function sletUddannelse(name) {
  try {
    await models.Uddannelser.destroy({
      where: {
        name: name,
      },
    });
    return "Uddannelse blev slettet"
  } catch (error) {
    console.log(error);
  }
} */

module.exports = {
  createUddanelse: createUddanelse,
  findUddannelseByName: findUddannelseByName,
  //sletUddannelse: sletUddannelse,
};
