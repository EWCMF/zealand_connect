

 //primære methode som kalder de andre
 document.addEventListener('DOMContentLoaded', () => { 
    let lang =document.documentElement.lang; // skaffer lang
    brugStrings(lang);

});
function brugStrings(lang) {
    var langdata = getLangdata()
    //køre igennem alt i dokumentet, leder efter data-key keys i html
    document.querySelectorAll('html [data-key]').forEach(element => {
        if(lang.includes('da')) {
            //console.log('stopper her')
             return;
        }
        //for hvert data-key værdi, leder den efter det i json navngivet langdata
        let key = element.getAttribute('data-key');

        if(key.includes('placeholder')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.placeholder = langdata.languages[lang].strings[key]
        }

        if(!key.includes('placeholder')) {
            //let temp = element.textContent;
            console.log(lang);
            element.textContent = langdata.languages[lang].strings[key];
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
                "placeholderadgangskode": "Password",
                "placeholdergentagAdgangskode": "Repeat Password",
                "husk-email": "Remember Email",
                "cookie": "Cookies must be enabled in your browser",
                "placeholdernavn": "Name",
                "placeholderefternavn": "Last name",
                "placeholdercpr": "CPR-Number",
                "placeholdercvr": "CVR-Number",
                "placeholderBy": "City",
                "placeholderPostnummer": "City code",
                "placeholderGentagEmail": "Repeat Email",
                "placeholderTelefonnummer": "Cell phone number",
                "opret": "Create User",
                "eller": "Or",
                "uddannelser": "Educations",
                "opretGoogle": "Sign up with Google",
                "administrationsøkonom": "Administration Economist",
                "autoteknolog": "Auto technologist",
                "Byggetekniker": "Construction technician",
                "Datamatiker": "Computer scientist",
                "ElInstallatør": "Electrician",
                "Finansøkonom": "Financial economist",
                "Handelsøkonom": "Business economist",
                "Jordbrugsteknolog":"Agricultural technologist",
                "Laborant": "Laboratory Technician",
                "Logistikøkonom": "Logistics economist",
                "Markedsføringsøkonom": "Marketing economist",
                "Multimediedesigner": "Multimedia designer",
                "Procesteknolog": "Process technologist",
                "Produktionsteknolog": "Production technologist",
                "Serviceøkonom": "Service economist",
                "VVSInstallatør": "Plumbing installer",
                "dokumenter": "Documents",
                "stilling": "Position",
                "efternavn": "Last Name",
                "navn": "First name",
                "kontaktperson": "Contact person",
                "beskrivelse": "Description",
                "CVR": "CVR-Number",
                "land": "Country",
                "addresse": "Address",
                "postnummerogby": "Zip code and city",
                "virksomhedsemail": "Corporation email",
                "virksomhedsnavn": "Corporation name",
                "virksomhedsoplysninger": "Corporation informations"


            }
        }
    }
    }
    return temp;
}