function showStudentOpret() {
    document.getElementById('studentOpret').style.display = "block";
    document.getElementById('virksomhedOpret').style.display = "none";
    document.getElementById('professorOpret').style.display = "none";
}

function showVirksomhedOpret() {
    document.getElementById('virksomhedOpret').style.display = "block";
    document.getElementById('studentOpret').style.display = "none";
    document.getElementById('professorOpret').style.display = "none";
}

function showProfessorOpret() {
    document.getElementById('professorOpret').style.display = "block";
    document.getElementById('studentOpret').style.display = "none";
    document.getElementById('virksomhedOpret').style.display = "none";
}

document.querySelectorAll('div.formError').forEach(element => {
    element.style.visibility = "hidden";
});

//Funktionel programmering. Disse constants kan bruges i rene funktioner da dem og deres værdier ikke kan ændres på nogen måde.
const inputs = Object.freeze({
    email: document.getElementById('email'),
    gentagEmail: document.getElementById('gentagEmail'),
    password: document.getElementById('adgangskode'),
    gentagPassword: document.getElementById('gentagAdgangskode'),
    virksomhedNavn: document.getElementById('virksomhedNavn'),
    cvrNummer: document.getElementById('cvr'),
    telefon: document.getElementById('telefonnummer'),
    by: document.getElementById('by'),
    postnummer: document.getElementById('postnummer'),
    consent: document.getElementById('companyConsentCreate')
});

const errors = Object.freeze({
    email: document.getElementById('emailError'),
    gentagEmail: document.getElementById('gentagEmailError'),
    password: document.getElementById('adgangskodeError'),
    gentagPassword: document.getElementById('gentagAdgangskodeError'),
    virksomhedNavn: document.getElementById('virksomhedNavnError'),
    cvrNummer: document.getElementById('cvrError'),
    telefon: document.getElementById('telefonnummerError'),
    by: document.getElementById('byError'),
    postnummer: document.getElementById('postnummerError')
});

const inputsStudent = Object.freeze({
    email: document.getElementById('emailStudent'),
    gentagEmail: document.getElementById('gentagEmailStudent'),
    password: document.getElementById('adgangskodeStudent'),
    gentagPassword: document.getElementById('gentagAdgangskodeStudent'),
    fornavn: document.getElementById('fornavnStudent'),
    efternavn: document.getElementById('efternavnStudent'),
    telefon: document.getElementById('telefonnummerStudent'),
    dato: document.getElementById('date'),
    consent: document.getElementById('studentConsent')
});

const errorsStudent = Object.freeze({
    email: document.getElementById('emailErrorStudent'),
    gentagEmail: document.getElementById('gentagEmailErrorStudent'),
    password: document.getElementById('adgangskodeErrorStudent'),
    gentagPassword: document.getElementById('gentagAdgangskodeErrorStudent'),
    fornavn: document.getElementById('fornavnErrorStudent'),
    efternavn: document.getElementById('efternavnErrorStudent'),
    telefon: document.getElementById('telefonnummerErrorStudent'),
    dato: document.getElementById('dateErrorStudent')
});

const inputsProfessor = Object.freeze({
    email: document.getElementById('emailProfessor'),
    gentagEmail: document.getElementById('gentagEmailProfessor'),
    password: document.getElementById('adgangskodeProfessor'),
    gentagPassword: document.getElementById('gentagAdgangskodeProfessor'),
    fornavn: document.getElementById('fornavnProfessor'),
    efternavn: document.getElementById('efternavnProfessor'),
    consent: document.getElementById('professorConsent')
});

const errorsProfessor = Object.freeze({
    email: document.getElementById('emailErrorProfessor'),
    gentagEmail: document.getElementById('gentagEmailErrorProfessor'),
    password: document.getElementById('adgangskodeErrorProfessor'),
    gentagPassword: document.getElementById('gentagAdgangskodeErrorProfessor'),
    fornavn: document.getElementById('fornavnErrorProfessor'),
    efternavn: document.getElementById('efternavnErrorProfessor'),
});


async function checkEmail(input, error) {
    let regex = emailRegex

    if (!regex.test(input)) {
        if (!error.classList.contains('formError')) {
            error.classList.add('formError');
        }
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("mailUgyldig");
        return false;
    }

    let valid = await checkEmailExists(input);

    error.style.visibility = 'visible';

    if (!valid) {
        if (!error.classList.contains('formError')) {
            error.classList.add('formError');
        }
        error.textContent = translateErrorMessage("mailIBrug");
        return false;
    }

    if (error.classList.contains('formError')) {
        error.classList.remove('formError');
    }
    error.textContent = translateErrorMessage("mailLedig");

    return true;
};

function checkCvrNummer(input, error) {
    if (!input){
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("feltIkkeTomt");
        return false;
    } else if (!cvrRegex.test(input)) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("CvrFejl");
        return false;
    }

    error.style.visibility = 'visible';

    if (error.classList.contains('formError')) {
        error.classList.remove('formError');
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkEmailExists(input) {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let response = JSON.parse(this.responseText);
            if (response.email == 'invalid') {
                return resolve(false);
            }

            resolve(true);
        }
        xhr.open('POST', '/opret-bruger/check-email');
        xhr.send(input);
    });
}

function checkCvrExists(input) {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let response = JSON.parse(this.responseText);
            if (response.cvr == 'invalid') {
                return resolve(false);
            }

            resolve(true);
        }
        xhr.open('POST', '/opret-bruger/check-cvr');
        xhr.send(input);
    });
}

function checkGentagEmail(input, error, compare) {

    if (input != compare) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("mailIkkeEns");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkAdgangskode(input, error) {
    let regex = /.{8,20}/;

    if (!regex.test(input)) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("passwordUgyldig")
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkGentagAdgangskode(input, error, compare) {

    if (input != compare) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("passwordIkkeEns");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkFeltIkkeTomt(input, error) {

    if (input.length == 0) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("feltIkkeTomt");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkTelefon(input, error) {
    let regex = phoneRegex;

    if (!regex.test(input)) {
        error.style.visibility = 'visible';
        error.textContent = translateErrorMessage("telefonFejl");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkPostnummer(input, error) {
    let regex = dkPostcodeRegex;

    if (!regex.test(input)) {
        error.style.visibility = 'visible';
        error.textContent = translateErrorMessage('postnummerFejl');
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
}

function checkDato() {
    let today = Date.now();
    let input = new Date(inputsStudent.dato.value);
    let error = errorsStudent.dato;

    if (input == "Invalid Date") {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("datoMissing");
        return false;
    }

    if (input > today) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("datoFejl");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
}

function checkInputRegex(input, error, regex) {
    if (!regex.test(input) || !input) {
        error.style.visibility = 'visible';
        return false;
    } else {
        error.style.visibility = 'hidden';
        return true;
    }
};

// Company block
inputs.email.addEventListener('change', function () {
    checkEmail(inputs.email.value, errors.email)
});
inputs.gentagEmail.addEventListener('change', function () {
    checkGentagEmail(inputs.gentagEmail.value, errors.gentagEmail, inputs.email.value);
});
inputs.password.addEventListener('change', function () {
    checkAdgangskode(inputs.password.value, errors.password);
    if (inputs.gentagPassword.value) {
        checkGentagAdgangskode(inputs.gentagPassword.value, errors.gentagPassword,
            inputs.password.value);
    }
});
inputs.gentagPassword.addEventListener('change', function () {
    checkGentagAdgangskode(inputs.gentagPassword.value, errors.gentagPassword,
        inputs.password.value);
});
inputs.virksomhedNavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputs.virksomhedNavn.value, errors.virksomhedNavn);
});
inputs.cvrNummer.addEventListener('change', function() {
    checkCvrNummer(inputs.cvrNummer.value, errors.cvrNummer)
});
inputs.telefon.addEventListener('change', function () {
    checkTelefon(inputs.telefon.value, errors.telefon);
})
inputs.by.addEventListener('change', function () {
    checkInputRegex(inputs.by.value, errors.by, cityRegex);
});
inputs.postnummer.addEventListener('change', function () {
    checkFeltIkkeTomt(inputs.postnummer.value, errors.postnummer);
});

async function submitOpretVirksomhed() {
    document.getElementById('submitBtn').onclick = null;

    let checks = [
        checkGentagEmail(inputs.gentagEmail.value, errors.gentagEmail, inputs.email.value),
        checkAdgangskode(inputs.password.value, errors.password),
        checkGentagAdgangskode(inputs.gentagPassword.value, errors.gentagPassword, inputs.password.value),
        checkFeltIkkeTomt(inputs.virksomhedNavn.value, errors.virksomhedNavn),
        checkTelefon(inputs.telefon.value, errors.telefon),
        checkInputRegex(inputs.by.value, errors.by, cityRegex),
        checkFeltIkkeTomt(inputs.postnummer.value, errors.postnummer),
        checkCvrNummer(inputs.cvrNummer.value, errors.cvrNummer)
    ];

    let check = true;
    checks.every(element => {
        if (element == false) {
            check = false;
            return false;
        }
        return true;
    });

    if (!check) {
        document.getElementById('submitBtn').onclick = submitOpretVirksomhed;
        return;
    }

    let emailCheck = await checkEmail(inputs.email.value, errors.email);
    let CVRcheck = await checkCvrNummer();

    if (!emailCheck || !CVRcheck) {
        document.getElementById('submitBtn').onclick = submitOpretVirksomhed;
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // hvis brugeren ikke er logget ind, så returnere kaldet undefined eller en email
            let responseObject = JSON.parse(this.responseText);
            //if there were no errors, then begin automatic login and redirect to profile
            if (responseObject.areThereErrors == "false") {
                //send login request baseret på values i input felter
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        window.location.href = "../profil";
                    }
                }
                xhttp.open("POST", "/login/authenticateUser", true);
                xhttp.setRequestHeader("Content-Type", "text/plain")
                xhttp.send(JSON.stringify({
                    email: inputs.email.value,
                    password: inputs.password.value,
                }));
            }
        }
    }
    xhttp.open("POST", "/opret-bruger/create", true);
    xhttp.send(JSON.stringify({
        email: inputs.email.value,
        gentagEmail: inputs.gentagEmail.value,
        password: inputs.password.value,
        gentagPassword: inputs.gentagPassword.value,
        virksomhedNavn: inputs.virksomhedNavn.value,
        tflnr: inputs.telefon.value,
        by: inputs.by.value,
        postnr: inputs.postnummer.value,
        cvrnr: inputs.cvrNummer.value,
        consent: inputs.consent.value
    }));
};

// Student Block
inputsStudent.email.addEventListener('change', function () {
    checkEmail(inputsStudent.email.value, errorsStudent.email)
});
inputsStudent.gentagEmail.addEventListener('change', function () {
    checkGentagEmail(inputsStudent.gentagEmail.value, errorsStudent.gentagEmail, inputsStudent.email.value);
});
inputsStudent.password.addEventListener('change', function () {
    checkAdgangskode(inputsStudent.password.value, errorsStudent.password);
    if (inputsStudent.gentagPassword.value) {
        checkGentagAdgangskode(inputsStudent.gentagPassword.value, errorsStudent.gentagPassword,
            inputsStudent.password.value);
    }
});
inputsStudent.gentagPassword.addEventListener('change', function () {
    checkGentagAdgangskode(inputsStudent.gentagPassword.value, errorsStudent.gentagPassword,
        inputsStudent.password.value);
});
inputsStudent.fornavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputsStudent.fornavn, errorsStudent.fornavn);
});
inputsStudent.efternavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputsStudent.efternavn, errorsStudent.efternavn);
});
inputsStudent.telefon.addEventListener('change', function () {
    checkTelefon(inputsStudent.telefon.value, errorsStudent.telefon);
})
inputsStudent.dato.addEventListener('change', function () {
    checkDato();
});

async function submitOpretStudent() {
    document.getElementById('submitBtn_Student').onclick = null;

    let checks = [
        checkGentagEmail(inputsStudent.gentagEmail.value, errorsStudent.gentagEmail, inputsStudent.email.value),
        checkAdgangskode(inputsStudent.password.value, errorsStudent.password),
        checkGentagAdgangskode(inputsStudent.gentagPassword.value, errorsStudent.gentagPassword, inputsStudent.password.value),
        checkFeltIkkeTomt(inputsStudent.fornavn.value, errorsStudent.fornavn),
        checkFeltIkkeTomt(inputsStudent.efternavn.value, errorsStudent.efternavn),
        checkTelefon(inputsStudent.telefon.value, errorsStudent.telefon),
        checkDato()
    ];

    let check = true;
    checks.every(element => {
        if (element == false) {
            check = false;
            return false;
        }
        return true;
    });

    if (!check) {
        document.getElementById('submitBtn_Student').onclick = submitOpretStudent;
        return;
    }

    let emailCheck = await checkEmail(inputsStudent.email.value, errorsStudent.email);

    if (!emailCheck) {
        document.getElementById('submitBtn_Student').onclick = submitOpretStudent;
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // hvis brugeren ikke er logget ind, så returnere kaldet undefined eller en email
            let responseObject = JSON.parse(this.responseText)
            // if there were no errors, then begin automatic login and redirect to profile
            if (responseObject.areThereErrors == "false") { // send login request baseret på values i input felter
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        window.location.href = "../profil";
                    }
                }
                xhttp.open("POST", "/login/authenticateUser", true); // ret her
                xhttp.setRequestHeader("Content-Type", "text/plain")
                xhttp.send(JSON.stringify({
                    email: inputsStudent.email.value,
                    password: inputsStudent.password.value
                }));
            }
        }
    }
    xhttp.open("POST", "/opret-bruger/studentCreate", true); // ret her
    xhttp.setRequestHeader("Content-Type", "text/plain")
    xhttp.send(JSON.stringify({
        email: inputsStudent.email.value,
        gentagEmail: inputsStudent.gentagEmail.value,
        password: inputsStudent.password.value,
        gentagPassword: inputsStudent.gentagPassword.value,
        tflnr: inputsStudent.telefon.value,
        fornavn: inputsStudent.fornavn.value,
        efternavn: inputsStudent.efternavn.value,
        dato: inputsStudent.dato.value,
        consent: inputsStudent.consent.value
    }));
};

// Professor Block
inputsProfessor.email.addEventListener('change', function () {
    checkEmail(inputsProfessor.email.value, errorsProfessor.email)
});
inputsProfessor.gentagEmail.addEventListener('change', function () {
    checkGentagEmail(inputsProfessor.gentagEmail.value, errorsProfessor.gentagEmail, inputsProfessor.email.value);
});
inputsProfessor.password.addEventListener('change', function () {
    checkAdgangskode(inputsProfessor.password.value, errorsProfessor.password);
    if (inputsProfessor.gentagPassword.value) {
        checkGentagAdgangskode(inputsProfessor.gentagPassword.value, errorsProfessor.gentagPassword,
            inputsProfessor.password.value);
    }
});
inputsProfessor.gentagPassword.addEventListener('change', function () {
    checkGentagAdgangskode(inputsProfessor.gentagPassword.value, errorsProfessor.gentagPassword,
        inputsProfessor.password.value);
});
inputsProfessor.fornavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputsProfessor.fornavn, errorsProfessor.fornavn);
});
inputsProfessor.efternavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputsProfessor.efternavn, errorsProfessor.efternavn);
});

async function submitOpretProfessor() {
    console.log("test1")

    document.getElementById('submitBtn_Professor').onclick = null;

    console.log("test2")

    let checks = [
        checkGentagEmail(inputsProfessor.gentagEmail.value, errorsProfessor.gentagEmail, inputsProfessor.email.value),
        checkAdgangskode(inputsProfessor.password.value, errorsProfessor.password),
        checkGentagAdgangskode(inputsProfessor.gentagPassword.value, errorsProfessor.gentagPassword, inputsProfessor.password.value),
        checkFeltIkkeTomt(inputsProfessor.fornavn.value, errorsProfessor.fornavn),
        checkFeltIkkeTomt(inputsProfessor.efternavn.value, errorsProfessor.efternavn),
    ];

    console.log("test3")

    let check = true;
    checks.every(element => {
        if (element == false) {
            check = false;
            return false;
        }
        return true;
    });

    console.log("test4")

    if (!check) {
        document.getElementById('submitBtn_Professor').onclick = submitOpretProfessor;
        return;
    }

    console.log("test5")

    let emailCheck = await checkEmail(inputsProfessor.email.value, errorsProfessor.email);

    console.log("test6")

    if (!emailCheck) {
        document.getElementById('submitBtn_Professor').onclick = submitOpretProfessor;
        return;
    }

    console.log("test7")

    console.log(checks)
    console.log(emailCheck)

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { // hvis brugeren ikke er logget ind, så returnere kaldet undefined eller en email
            let responseObject = JSON.parse(this.responseText)
            // if there were no errors, then begin automatic login and redirect to profile
            if (responseObject.areThereErrors == "false") { // send login request baseret på values i input felter
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        window.location.href = "../profil";
                    }
                }
                xhttp.open("POST", "/login/authenticateUser", true); // ret her
                xhttp.setRequestHeader("Content-Type", "text/plain")
                xhttp.send(JSON.stringify({
                    email: inputsProfessor.email.value,
                    password: inputsProfessor.password.value
                }));
            }
        }
    }
    xhttp.open("POST", "/opret-bruger/ProfessorCreate", true); // ret her
    xhttp.setRequestHeader("Content-Type", "text/plain")
    xhttp.send(JSON.stringify({
        email: inputsProfessor.email.value,
        gentagEmail: inputsProfessor.gentagEmail.value,
        password: inputsProfessor.password.value,
        gentagPassword: inputsProfessor.gentagPassword.value,
        fornavn: inputsProfessor.fornavn.value,
        efternavn: inputsProfessor.efternavn.value,
        consent: inputsProfessor.consent.value
    }));
};

function translateErrorMessage(key) {
    let texts = {
        "da": {
            "mailUgyldig": "Den angivne mail er ikke gyldig",
            "mailIBrug": "Den angivne mail er allerede i brug",
            "mailLedig": "Den angivne mail er ledig",
            "mailIkkeEns": "De angivne mails er ikke ens",
            "passwordUgyldig": "Adgangskoden er ikke gyldig. Se hjælpen til venstre",
            "passwordIkkeEns": "De angivne adgangskoder er ikke ens",
            "feltIkkeTomt": "Feltet må ikke være tomt",
            "CvrFejl": "Et CVR-nummer skal angives med nøjagtig 8 cifre",
            "cvrIBrug": "Det angivne CVR-nummer er allerede i brug",
            "cvrLedig": "Det angivne CVR-nummer er ledigt",
            "telefonFejl": "Telefonnummeret er ugyldigt",
            "datoFejl": "En fremtidig dato er valgt",
            "datoMissing": "Ugyldig dato",
            "postnummerFejl": "Det angivne postnummer er ugyldigt"
        },

        "en": {
            "mailUgyldig": "The specified mail is not valid",
            "mailIBrug": "The specified mail is already in use",
            "mailLedig": "The specified mail is available",
            "mailIkkeEns": "The specified mails are not the same",
            "passwordUgyldig": "The password is invalid. See info on the left",
            "passwordIkkeEns": "The specified passwords are not the same",
            "feltIkkeTomt": "This field cannot be empty",
            "CvrFejl": "A CVR number must be specified with exactly 8 digits",
            "cvrIBrug": "This CVR number is already in use",
            "cvrLedig": "The specified mail is available",
            "telefonFejl": "The phone number is invalid",
            "datoFejl": "A future date has been chosen",
            "datoMissing": "Invalid date",
            "postnummerFejl": "The specified postcode is invalid"
        }
    }

    let useEnglish = document.cookie.includes('lang=en');

    let table;
    if (useEnglish) {
        table = "en";
    } else {
        table = "da";
    }

    return texts[table][key];
};

function checkConsentStudOpretBruger(){
    let consentCheckbox = document.getElementById("OpretBrugerStudConsent");
    let submitButtonStudent = document.getElementById("submitBtn_Student");

    submitButtonStudent.disabled = !consentCheckbox.checked;
}

function checkConsentVirkOpretBruger(){
    let consentCheckbox = document.getElementById("OpretBrugerVirkConsent");
    let submitButtonStudent = document.getElementById("submitBtn");

    submitButtonStudent.disabled = !consentCheckbox.checked;
}

function checkConsentProOpretBruger(){
    let consentCheckbox = document.getElementById("OpretBrugerProConsent");
    let submitButtonProfessor = document.getElementById("submitBtn_Professor");

    submitButtonProfessor.disabled = !consentCheckbox.checked;
}