const models = require("../models");

async function createUddanelse(nameobj) {
    if ( await findUddannelseByName(nameobj) === null) {
    try {
      const uddannelse = await models.Uddannelser.create({
        name: nameobj,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

async function findUddannelseByName(name) {
  let user = null;
  return new Promise((resolve) => {
    console.log("--finding uddannelse by Name: " + name + "---");
    models.Uddannelser.findOne({
      where: { name: name },
    }).then((uddannelser) => {
      if (uddannelser === null) {
        console.log("en uddannelse med dette navn findes ikke!");
      }
      if (uddannelser instanceof models.Uddannelser) {
        console.log("--- fandt en uddannelse med navnet ---");
        user = uddannelser;
      }
      resolve(user);
    });
  });
}
module.exports = {
  createUddanelse: createUddanelse,
  findUddannelseByName: findUddannelseByName,
};
