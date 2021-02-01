document.querySelectorAll('div.formError').forEach(element => {
    element.style.visibility = "hidden";
});

//Funktionel programmering. Disse constants kan bruges i rene funktioner da dem og deres værdier ikke kan ændres på nogen måde.
const inputs = Object.freeze({
    fornavn: document.getElementById('fornavn'),
    efternavn: document.getElementById('efternavn'),
    telefon: document.getElementById('telefonnummer'),
    password: document.getElementById('adgangskode'),
    gentagPassword: document.getElementById('gentagAdgangskode'),
    profilbillede: document.getElementById('profilbillede')
});

const errors = Object.freeze({
    fornavn: document.getElementById('fornavnError'),
    efternavn: document.getElementById('efternavnError'),
    telefon: document.getElementById('telefonnummerError'),
    password: document.getElementById('adgangskodeError'),
    gentagPassword: document.getElementById('gentagAdgangskodeError'),
    profilbillede: document.getElementById('profilbilledeError')
});

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

function checkTelefon(input, error) {
    let regex = /^[0-9]{8}$/;

    if (!regex.test(input)) {
        error.style.visibility = 'visible'
        error.textContent = translateErrorMessage("telefonFejl");
        return false;
    }

    error.style.visibility = 'hidden';
    error.textContent = 'Error';

    return true;
};

inputs.fornavn.addEventListener('change', function () {
    checkFornavn(inputs.fornavn.value, errors.fornavn);
})
inputs.efternavn.addEventListener('change', function () {
    checkEfternavn(inputs.efternavn.value, errors.efternavn);
})
inputs.telefon.addEventListener('change', function () {
    checkTelefon(inputs.telefon.value, errors.telefon);
})
inputs.password.addEventListener('change', function () {
    checkAdgangskode(inputs.password.value, errors.password);
});
inputs.gentagPassword.addEventListener('change', function () {
    inputs.gentagPassword.value,
        errors.gentagPassword,
        inputs.password.value
});

async function submitRedigerProfil() {
    document.getElementById('submitBtn_Student').onclick = null;

    let checks = [
        checkGentagEmail(inputs.gentagEmail.value, errors.gentagEmail, inputs.email.value),
        checkAdgangskode(inputs.password.value, inputs.password),
        checkGentagAdgangskode(inputs.gentagPassword.value, inputs.gentagPassword, inputs.password.value),
        checkTelefon(inputs.telefon.value, inputs.telefon)
    ];

    let check = true;
    checks.forEach(element => {
        if (element == false) {
            check = false;
        }
    });

    if (!check) {
        document.getElementById('submitBtn_Student').onclick = submitRedigerProfil;
        return;
    }
}

function translateErrorMessage(key) {
    let texts = {
        "da": {
            "passwordUgyldig": "Adgangskoden er ikke gyldig. Se hjælpen til venstre",
            "passwordIkkeEns": "De angivne adgangskoder er ikke ens",
            "telefonFejl": "Et telefonnummer skal angives med nøjagtig 8 cifre",
        },

        "en": {
            "passwordUgyldig": "The password is invalid. See info on the left",
            "passwordIkkeEns": "The specified passwords are not the same",
            "telefonFejl": "A phone number must be specified with exactly 8 digits",
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
}
