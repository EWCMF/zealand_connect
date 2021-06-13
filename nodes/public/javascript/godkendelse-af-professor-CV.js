
const inputs = Object.freeze({
    overskrift: document.getElementById("overskrift"),
    sprog: document.getElementById("sprog"),
    email: document.getElementById('email'),
    telefon: document.getElementById("telefon"),
    linkedIn: document.getElementById("linkedIn"),
    website: document.getElementById('website'),
    educationSelect: document.getElementById('educationSelect'),
    campus_id: document.getElementById("campus_id"),
    position_id: document.getElementById("position_id"),
    tidligere_uddannelse: document.getElementById("tidligere_uddannelse"),
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
    websiteError: document.getElementById('websiteError'),
    educationError: document.getElementById('educationError'),
    campus_idError: document.getElementById("campus_idError"),
    position_idError: document.getElementById("position_idError"),
    tidligere_uddannelseError: document.getElementById("tidligere_uddannelseError"),
    it_kompetencerError: document.getElementById('it_kompetencerError'),
    erhvervserfaringError: document.getElementById("erhvervserfaringError"),
    postcodeError: document.getElementById('postcodeError'),
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

    inputs.campus_id.addEventListener('change', function () {
        checkInputNotEmpty(inputs.campus_id, errors.campus_idError);
    });

    inputs.position_id.addEventListener('change', function (){
        checkInputNotEmpty(inputs.position_id, errors.position_idError);
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

    inputs.linkedIn.addEventListener('change', function () {
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex);
    });

    inputs.it_kompetencer.addEventListener('change', function () {
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError);
    });

    inputs.website.addEventListener('change', function () {
        checkInputRegexOptional(inputs.website, errors.websiteError, linkRegex);
    })

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
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex),
        checkInputRegexOptional(inputs.website, errors.websiteError, linkRegex),
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError),
        checkInputNotEmpty(inputs.tidligere_uddannelse, errors.tidligere_uddannelseError),
        checkInputNotEmpty(inputs.campus_id, errors.campus_idError),
        checkInputNotEmpty(inputs.position_id, errors.position_idError),
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