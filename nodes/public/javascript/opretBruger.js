function showStudentOpret() {
    document.getElementById('studentOpret').style.display = "block";
    document.getElementById('virksomhedOpret').style.display = "none";

}

function showVirksomhedOpret() {
    document.getElementById('virksomhedOpret').style.display = "block";
    document.getElementById('studentOpret').style.display = "none";
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
    postnummer: document.getElementById('postnummer')
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
    dato: document.getElementById('date')
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


async function checkEmail(input, error) {
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;

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

async function checkCvrNummer() {
    let regex = /^[0-9]{8}$/;
    let error = errors.cvrNummer;
    let input = inputs.cvrNummer.value;

    if (!regex.test(input)) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("CvrFejl");
        return false;
    }

    let valid = await checkCvrExists(input)

    error.style.visibility = 'visible';

    if (!valid) {
        if (!error.classList.contains('formError')) {
            error.classList.add('formError');
        }
        error.textContent = translateErrorMessage("cvrIBrug");
        return false;
    }
    if (error.classList.contains('formError')) {
        error.classList.remove('formError');
    }
    error.textContent = translateErrorMessage("cvrLedig");

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
    let regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    if (!regex.test(input)) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("telefonFejl");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

function checkDato() {
    let today = Date.now();
    let input = new Date(inputsStudent.dato.value);
    let error = errorsStudent.dato;

    if (input > today) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("datoFejl");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
}

inputs.email.addEventListener('change', function () {
    checkEmail(inputs.email.value, errors.email)
});
inputs.gentagEmail.addEventListener('change', function () {
    checkGentagEmail(inputs.gentagEmail.value, errors.gentagEmail, inputs.email.value);
});
inputs.password.addEventListener('change', function () {
    checkAdgangskode(inputs.password.value, errors.password);
});
inputs.gentagPassword.addEventListener('change', function () {
    inputs.gentagPassword.value,
        errors.gentagPassword,
        inputs.password.value
});
inputs.virksomhedNavn.addEventListener('change', function () {
    checkFeltIkkeTomt(inputs.virksomhedNavn.value, errors.virksomhedNavn);
});
inputs.cvrNummer.addEventListener('change', checkCvrNummer);
inputs.telefon.addEventListener('change', function () {
    checkTelefon(inputs.telefon.value, errors.telefon);
})
inputs.by.addEventListener('change', function () {
    checkFeltIkkeTomt(inputs.by.value, errors.by);
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
        checkCvrNummer(),
        checkTelefon(inputs.telefon.value, errors.telefon),
        checkFeltIkkeTomt(inputs.by.value, errors.by),
        checkFeltIkkeTomt(inputs.postnummer.value, errors.postnummer)
    ];

    let check = true;
    checks.forEach(element => {
        if (element == false) {
            check = false;
        }
    });

    check = await checkEmail(inputs.email.value, errors.email);
    check = await checkCvrNummer();

    if (!check) {
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
                xhttp.open("POST", "/login/authenticateVirksomhed", true);
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
        cvrnr: inputs.cvrNummer.value
    }));
};

inputsStudent.email.addEventListener('change', function () {
    checkEmail(inputsStudent.email.value, errorsStudent.email)
});
inputsStudent.gentagEmail.addEventListener('change', function () {
    checkGentagEmail(inputsStudent.gentagEmail.value, errorsStudent.gentagEmail, inputsStudent.email.value);
});
inputsStudent.password.addEventListener('change', function () {
    checkAdgangskode(inputsStudent.password.value, errorsStudent.password);
});
inputsStudent.gentagPassword.addEventListener('change', function () {
    inputsStudent.gentagPassword.value,
        errorsStudent.gentagPassword,
        inputsStudent.password.value
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
    checks.forEach(element => {
        if (element == false) {
            check = false;
        }
    });

    check = await checkEmail(inputsStudent.email.value, errorsStudent.email);

    if (!check) {
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
                xhttp.open("POST", "/login/authenticateStudent", true); // ret her
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
        dato: inputsStudent.dato.value
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
            "telefonFejl": "Et telefonnummer skal angives med nøjagtig 8 cifre",
            "datoFejl": "En fremtidig dato er valgt"
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
            "telefonFejl": "A phone number must be specified with exactly 8 digits",
            "datoFejl": "A future date has been chosen"
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
