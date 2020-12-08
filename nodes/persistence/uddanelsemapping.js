const models = require("../models");

async function createUddanelse(nameobj) {
    if ( await findUddannelseByName(nameobj) === null) {
    try {
      await models.Uddannelser.create({
        name: nameobj,
      });
      return "uddannelseOprettet";
    } catch (e) {
      console.log(e);
    }
  } else{
      return "uddannelseFindesAllerede";
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

/* til front-end når det bliver lavet
 function opret() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log('sending post for create')
                let responseObj = JSON.parse(this.responseText)
                console.log(responseObj)
            }
        }
        xhttp.open('POST', '/uddannelser/create', true);
        xhttp.setRequestHeader("Content-Type", "text/plain")
        xhttp.send(JSON.stringify ({
            name: document.getElementById('uddannelse').value
        }));
    }
*/



module.exports = {
  createUddanelse: createUddanelse,
  findUddannelseByName: findUddannelseByName,
};
