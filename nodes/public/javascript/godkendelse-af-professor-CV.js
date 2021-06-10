const inputs = Object.freeze({
    overskrift: document.getElementById("overskrift"),
    email: document.getElementById('email'),
    telefon: document.getElementById("telefon"),
    linkedIn: document.getElementById("linkedIn"),
    educationSelect: document.getElementById('educationSelect'),
    arbejdssted: document.getElementById("arbejdssted"),
    stilling: document.getElementById("stilling"),
    tidligere_uddannelse: document.getElementById("tidligere_uddannelse"),
    sprog: document.getElementById("sprog"),
    it_kompetencer: document.getElementById("it_kompetencer"),
    om_mig: document.getElementById("about"),
    erhvervserfaring: document.getElementById("erhvervserfaring"),
    interesser: document.getElementById("interesser"),
    postcode: document.getElementById('postcode'),
    tilgaengelighed1: document.getElementById('tilgaengelighed1'),
    tilgaengelighed2: document.getElementById('tilgaengelighed2')
});

const errors = Object.freeze({
    overskriftError: document.getElementById("overskriftError"),
    sprogError: document.getElementById("sprogError"),
    emailError: document.getElementById("emailError"),
    telefonError: document.getElementById("telefonError"),
    linkedInError: document.getElementById("linkedInError"),
    it_kompetencerError: document.getElementById('it_kompetencerError'),
    erhvervserfaringError: document.getElementById("erhvervserfaringError"),
    educationError: document.getElementById('educationError'),
    arbejdsstedError: document.getElementById("arbejdsstedError"),
    stillingError: document.getElementById("stillingError"),
    postcodeError: document.getElementById('postcodeError'),
    tidligere_uddannelseError: document.getElementById("tidligere_uddannelseError"),
    tilgaengelighedError: document.getElementById("tilgaengelighedError")
});

function checkInputNotEmpty(input, error) {
    let value = input.value; 
    
    if (!value) {
        error.hidden = false;
        return false;
    } else {
        error.hidden = true;
        return true;
    }
};

function checkInputRegex(input, error, regex) {
    let value = input.value;

    if (!regex.test(value)) {
        error.hidden = false;
        return false;
    } else {
        error.hidden = true;
        return true;
    }
};

function checkInputRegexOptional(input, error, regex) {
    let value = input.value;

    if (value && !regex.test(value)) {
        error.hidden = false;
        return false;
    } else {
        error.hidden = true;
        return true;
    }
}

function checkTilgaengelighed() {
    let radios = document.getElementsByClassName('tilgaengelighed');
    let tilgaengelighed;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            // get value, set checked flag or do whatever you need to
            tilgaengelighed = radios[i].value;
        }
    }

    if (!tilgaengelighed) {
        document.getElementById("tilgaengelighedError").hidden = false;
        return false;
    } else {
        document.getElementById("tilgaengelighedError").hidden = true;
        return true;
    }
}

function checkEducationNotEmpty() {
    let educations = []
      document.querySelectorAll('.educationCheckbox').forEach(element => {
        if (element.checked) {
          educations.push(element.value);
        }
      });
      if (educations.length == 0) {
        errors.educationError.hidden = false;
        return false;
      } else {
        errors.educationError.hidden = true;
        return true;
      }
  }

function addChangeEvents() {
    inputs.overskrift.addEventListener('change', function () {
        checkInputNotEmpty(inputs.overskrift, errors.overskriftError);
    });

    inputs.arbejdssted.addEventListener('change', function () {
        checkInputNotEmpty(inputs.arbejdssted, errors.arbejdsstedError);
    });

    inputs.stilling.addEventListener('change', function (){
        checkInputNotEmpty(inputs.stilling, errors.stillingError);
    })

    inputs.email.addEventListener('change', function () {
        checkInputRegex(inputs.email, errors.emailError, emailRegex);
    });

    inputs.sprog.addEventListener('change', function () {
        checkInputNotEmpty(inputs.sprog, errors.sprogError);
    });

    inputs.telefon.addEventListener('change', function () {
        checkInputRegex(inputs.telefon, errors.telefonError, phoneRegex)
    });

    inputs.postcode.addEventListener('change', function () {
        checkInputRegex(inputs.postcode, errors.postcodeError, postcodeRegex)
    });

    inputs.linkedIn.addEventListener('change', function () {
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex);
    });

    inputs.it_kompetencer.addEventListener('change', function () {
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError);
    });

    inputs.tidligere_uddannelse.addEventListener('change', function () {
        checkInputNotEmpty(inputs.tidligere_uddannelse, errors.tidligere_uddannelseError);
    });

    inputs.erhvervserfaring.addEventListener('change', function () {
        checkInputNotEmpty(inputs.erhvervserfaring, errors.erhvervserfaringError);
    });

    inputs.tilgaengelighed1.addEventListener('change', function () {
        checkTilgaengelighed();
    });

    inputs.tilgaengelighed2.addEventListener('change', function () {
        checkTilgaengelighed();
    });
};
addChangeEvents();


function translateErrorMessage(key) {
    let texts = {
        "da": {
            "mailMangler": "Udfyld emailfeltet",
            "typeMangler": "Angiv hvad du søger"
        },

        "en": {
            "mailMangler": "Please fill out the email field",
            "mailIBrug": "Specify what you're looking for",
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

function submitButton() {
    let all_valid = true;

    let checkInputs = [
        checkInputNotEmpty(inputs.overskrift, errors.overskriftError),
        checkEducationNotEmpty(),
        checkInputRegex(inputs.email, errors.emailError, emailRegex),
        checkInputNotEmpty(inputs.sprog, errors.sprogError),
        checkInputRegex(inputs.telefon, errors.telefonError, phoneRegex),
        checkInputRegex(inputs.postcode, errors.postcodeError, postcodeRegex),
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex),
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError),
        checkInputNotEmpty(inputs.tidligere_uddannelse, errors.tidligere_uddannelseError),
        checkInputNotEmpty(inputs.arbejdssted, errors.arbejdsstedError),
        checkInputNotEmpty(inputs.stilling, errors.stillingError),
        checkInputNotEmpty(inputs.erhvervserfaring, errors.erhvervserfaringError),
        checkTilgaengelighed()
    ];
    
    checkInputs.every(input => {
        if (!input) {
            all_valid = false;
            return false;
        }
        return true;
    });

    if (all_valid) {
        let educations = []
        document.querySelectorAll('.educationCheckbox').forEach(element => {
        if (element.checked) {
            educations.push(element.value);
        }
        });
        document.getElementById('educations').value = JSON.stringify(educations);

        document.forms["cvForm"].submit();
    }
};

function countChars(obj) {
    var maxLength = 255;
    var strLength = obj.value.length;
    var charRemain = (maxLength - strLength);
    if (charRemain < 0) {
        document.getElementById('charNum').innerHTML = '<span style="color:red;">Du har lavet mere end ' + maxLength + ' tegn</span>';
    } else {
        document.getElementById('charNum').innerHTML = charRemain + ' tegn tilbage';
    }
}
function countChars2(obj) {
    var maxLength = 255;
    var strLength = obj.value.length;
    var charRemain = (maxLength - strLength);
    if (charRemain < 0) {
        document.getElementById('charNum2').innerHTML = '<span style="color:red;">Du har lavet mere end ' + maxLength + ' tegn</span>';
    } else {
        document.getElementById('charNum2').innerHTML = charRemain + ' tegn tilbage';
    }
}