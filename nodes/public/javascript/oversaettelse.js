

 //primære methode som kalder de andre
 document.addEventListener('DOMContentLoaded', () => { 
    let lang =document.documentElement.lang; // skaffer lang
    brugStrings(lang);

});
function brugStrings(lang) {
    var langdata = getLangdata()
    //køre igennem alt i dokumentet, leder efter data-key keys i html
    document.querySelectorAll('html [data-key]').forEach(element => {
        //for hvert data-key værdi, leder den efter det i json navngivet langdata
        let key = element.getAttribute('data-key');

        if(key.includes('placeholder')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.placeholder = langdata.languages[lang].strings[key]
        }

        if(!key.includes('placeholder')) {
            //let temp = element.textContent;
            console.log(lang);
            if(!lang.includes('da')) {element.textContent = langdata.languages[lang].strings[key];}
            // if(!key.includes("+hbs")) { // hvis der er +hbs, så appender det ikke
            // element.textContent += temp}
        }
    });
}

function getLangdata() {
    var temp = {"languages":{
        "en": {
            "strings": {
                "studerende": "Students",
                "virksomhed": "Business",
                "adgangskode": "Password",
                "gentagAdgangskode": "Repeat Password",
                "husk-email": "Remember Email",
                "cookie": "Cookies must be enabled in your browser"
            }
        }
    }
    }
    return temp;
}