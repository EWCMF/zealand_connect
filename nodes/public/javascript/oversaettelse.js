

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
        if(key.includes('input')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.value = langdata.languages[lang].strings[key]
        }
    });
}

function getLangdata() {
    var temp = {"languages":{
        "en": {
            "strings": {
                "studerende": "Students",
                "virksomhed": "Business",
                "labelPaakraevet": "Required",
                "labelValgfri": "Optional",
                "labelFirmanavn": "Company Name",
                "labelLogo": "Company Logo",
                "labelAdresse": "Address",
                "labelHjemmeside": "Website",
                "labelDirektoer": "CEO",
                "labelLand": "Country",
                "labelVaelgFil": "Select File",
                "labeladgangskode": "Password",
                "aAlleCVer": "All Resumes",
                "aAllePraktikopslag": "All Internship posts",
                "aLavPraktikopslag": "Create Internship post",
                "aVirksomheder": "Companies",
                "aOpslag": "Posts",
                "aForVirksomheder": "For Companies",
                "aFaaEnPraktikant": "Get an Intern",
                "aPraktikForloebet": "Internship Course",
                "aArbejdstidOgLæringsmål": "Working hours and Learning Objectives",
                "aLoen": "Salary",
                "aSamarbajdeOgSparring": "Cooperation and Sparring",
                "aForsikring": "Insurance",
                "aKontaktperson": "Contact",
                "aPraktikkontrakten": "Internship Contract",
                "aEvtProblemer": "Issues",
                "aForStuderende": "For Students",
                "aLogin": "Login",
                "aLogud": "Log out",
                "aProfil": "Profile",
                "aMitCV": "My Resume",
                "aMinePraktikOpslag": "My Internship posts",
                "opretBruger": "Sign Up",
                "inputNulstilAdgangskode": "Reset Password",
                "inputGemAendringer": "Save Changes",
                "placeholderadgangskode": "Password",
                "labelgentagAdgangskode": "Repeat Password",
                "placeholdergentagAdgangskode": "Repeat Password",
                "husk-email": "Remember Email",
                "cookie": "Cookies must be enabled in your browser",
                "placeholdernavn": "Name",
                "placeholderefternavn": "Last name",
                "labelcvr": "CVR-Number",
                "placeholdercpr": "CPR-Number",
                "placeholdercvr": "CVR-Number",
                "labelBy": "City",
                "placeholderBy": "City",
                "labelPostnummer": "City code",
                "placeholderPostnummer": "City code",
                "labelGentagEmail": "Repeat Email",
                "placeholderGentagEmail": "Repeat Email",
                "labelTelefonnummer": "Cell phone number",
                "placeholderTelefonnummer": "Cell phone number",
                "opretBruger": "Create User",
                "sletBruger": "Delete User",
                "opret": "Create",
                "slet": "Delete",
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
                "adresse": "Address",
                "postnummerogby": "Zip code and city",
                "email": "Corporation email",
                "navn": "Corporation name",
                "oplysninger": "Corporation informations",
                "telefon": "Cel phone number",
                "direktoer": "Director",
                "adminFunktion": "Administrative functions",
                "opretUddannelse": "Create education",
                "sletUddannelse": "Delete education",
                "uddannelse": "Education"


            }
        }
    }
    }
    return temp;
}