

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
            element.placeholder = langdata.languages[lang].strings[key];
            return;
        }

        if(key.includes('input')) { // beregnet til input, så placeholder kan vises på dansk og engelsk
            element.value = langdata.languages[lang].strings[key];
            return;
        }

        if(key.includes('html')) {
            element.innerHTML = langdata.languages[lang].strings[key];
            return;
        }

        element.textContent = langdata.languages[lang].strings[key];
    });
}

function getLangdata() {
    var temp = {"languages":{
        "en": {
            "strings": {
                // Mixed elements
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
                "Efternavn": "Last Name",
                "placeholderEfternavn": "Last name",
                "Fornavn": "First name",
                "placeholderFornavn": "First name",
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
                "uddannelse": "Education",

                // Frontpage
                "Arbejdstid_og_laeringsmaal": "Work hours and learning objectives",
                "Loen": "Payment",
                "Forsikring": "Insurance",
                "Praktikaftale": "Internship agreement",
                "Praktikperiode": "Internship",
                "For_virksomheden": "For the company",
                "For_studerende": "For students",
                "forside_slogan": "ZealandConnect - create your future",
                "student_quick_access_headline" : "For students",
                "student_quick_access_btn": "Find your next job or internship. You can also create and publish a CV.",
                "student_quick_access_internship_headline": "Browse posts",
                "student_quick_access_internship_btn": "Browse a list of posts published by companies.",
                "student_quick_access_CV_headline": "Create CV",
                "student_quick_access_CV_btn": "Create a CV or edit an existing CV.",
                "company_quick_access_headline" : "For companies",
                "company_quick_access_btn": "Create and publish internship or job postings. You can also search the list of public student CV's.",
                "company_quick_access_CV_headline": "Browse CV list",
                "company_quick_access_CV_btn": "Find a suitable intern for your company.",

                // Log ind som studerende
                "Log_paa_med_din_organizationskonto": "Log in to your account",
                "Log_paa": "Log in",
                "login_help": "Use your EASJ email to log in",
                "forgot_password": 'Forgot your password? Send a text message with the word "kodeord" to 50 76 27 10.',
                "email_placeholder": "someone@example.com",
                "password_placeholder": "Password",

                // Navbar
                "aKontakt": "Contact",
                "aAlleCVer": "All Resumes",
                "aAllePraktikopslag": "All Internship posts",
                "aLavPraktikopslag": "Create Internship post",
                "aVirksomheder": "Companies",
                "aOpslag": "Posts",
                "aFaktaOmPraktik": "About internship",
                "aAdministratorfunktioner": "Administrator functions",
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
                "aOpretBruger": "Create user",

                // search-cv
                "CV'er": "CV's",
                "Uddannelser_html": 'Education <img src="images/chevron-right.svg" width="12" height="12">',
                "Land_html": 'Country <img src="images/chevron-right.svg" width="12" height="12">',
                "Indland": "Domestic",
                "Udland": "Abroad",
                "resultater": "results",
                "Sortering": "Sort by",
                "Senest_opdateret": "Recently updated",
                "Raekkefoelge": "Order",
                "Faldende": "Descending",
                "Stigende": "Ascending",

                // search-praktik
                "Opslag": "Posts",
                "Opslagstype_html": 'Post type <img src="images/chevron-right.svg" width="12" height="12">',
                "Praktik": "Internship",
                "Studiejob": "Student job",
                //Uddannelser_html,
                //Land_html,
                //Indland,
                //Udland,
                "By_html": 'City <img src="images/chevron-right.svg" width="12" height="12">',
                "Indtast_postnummer": "Enter postcode",
                "Soeg": "Search",
                "Ryd": "Clear",
                //resultater,
                //Sortering,
                //Senest_opdateret,
                //Raekkefoelge
                //Faldende,
                //Stigende

                
            }
        }
    }
    }
    return temp;
}