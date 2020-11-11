Oversættelse er opbygget med følgende filer:
nodes\public\javascript\oversaettelse.js
nodes\public\javascript\request.js

request skaffer browserens sprog, hvor den kontrollere dansk først og så engelsk.
i router filen som render filen der skal oversættes indsættes

var { reqLang } = require('../public/javascript/request');
og
{language: reqLang(req)} inde i render kaldet => res.render('login', {language: reqLang(req)}) 

i oversaettelse funktionen getLang findes json objektet hvori i skal tilføje de forskellige "keys" og tilhørende strings værdier
hvis det er til en placeholder værdi som f.eks. i forms /input så skal "key" indeholde "placeholder" i data-key navnet.
f.eks.
data-key="placeholderadgangskode" eller data-key="adgangskodeplaceholder" 