
document.getElementById("gem").onclick = function () { submitButton() };
document.getElementById("preview").onclick = function () { preview_cv() };

const inputs = Object.freeze({
    overskrift: document.getElementById("overskrift"),
    email: document.getElementById('email'),
    telefon: document.getElementById("telefon"),
    linkedIn: document.getElementById("linkedIn"),
    youtube_link: document.getElementById("youtube_link"),
    uddannelse: document.getElementById("uddannelse"),
    tidligere_uddannelse: document.getElementById("tidligere_uddannelse"),
    sprog: document.getElementById("sprog"),
    it_kompetencer: document.getElementById("it_kompetencer"),
    speciale: document.getElementById("speciale"),
    om_mig: document.getElementById("om mig"),
    UogFA: document.getElementById("UogFA"),
    erhvervserfaring: document.getElementById("erhvervserfaring"),
    hjemmeside: document.getElementById("hjemmeside"),
    fritidsinteresser: document.getElementById("fritidsinteresser"),
    postcode: document.getElementById('postcode'),
    praktik: document.getElementById('praktikCheck'),
    studiejob: document.getElementById('studiejobCheck'),
    trainee: document.getElementById('traineeCheck'),
    fuldtidsjob: document.getElementById('fuldtidCheck'),
    post_subscription: document.getElementById('post_subscription'),
    tilgaengelighed0: document.getElementById('tilgaengelighed0'),
    tilgaengelighed1: document.getElementById('tilgaengelighed1'),
    tilgaengelighed2: document.getElementById('tilgaengelighed2'),
});

const errors = Object.freeze({
    post_subscriptionError: document.getElementById('post_subscriptionError'),
    overskriftError: document.getElementById("overskriftError"),
    sprogError: document.getElementById("sprogError"),
    emailError: document.getElementById("emailError"),
    telefonError: document.getElementById("telefonError"),
    linkedInError: document.getElementById("linkedInError"),
    youtubeError: document.getElementById('youtubeError'),
    it_kompetencerError: document.getElementById('it_kompetencerError'),
    hjemmesideError: document.getElementById('hjemmesideError'),
    uddannelsesError: document.getElementById("uddannelsesError"),
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

function checkEmailSubscription() {
    let post_subscription = inputs.post_subscription;
    let email = inputs.email;
    let error = errors.post_subscriptionError;
    let cvTypes = {
        praktik: inputs.praktik,
        studiejob: inputs.studiejob,
        trainee: inputs.trainee,
        fuldtidsjob: inputs.fuldtidsjob
    }

    if (!post_subscription.checked) {
        return true;
    }

    let typeSelected = false;
    for (const type in cvTypes) {
        if (Object.hasOwnProperty.call(cvTypes, type)) {
            const element = cvTypes[type];
            if (element.checked) {
                typeSelected = true;
                break;
            }
        }
    };

    if (!email.value) {
        error.hidden = false;
        error.innerHTML = translateErrorMessage('mailMangler');
        return false;
    };

    if (!typeSelected) {
        error.hidden = false;
        error.innerHTML = translateErrorMessage('typeMangler');
        return false;
    };

    error.hidden = true;
    return true;
};

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

function addChangeEvents() {
    inputs.overskrift.addEventListener('change', function () {
        checkInputNotEmpty(inputs.overskrift, errors.overskriftError);
    });

    inputs.uddannelse.addEventListener('change', function () {
        checkInputNotEmpty(inputs.uddannelse, errors.uddannelsesError);
    });

    inputs.email.addEventListener('change', function () {
        checkEmailSubscription();
        checkInputRegex(inputs.email, errors.emailError, emailRegex);
    });

    inputs.sprog.addEventListener('change', function () {
        checkInputNotEmpty(inputs.sprog, errors.sprogError);
    });

    inputs.telefon.addEventListener('change', function () {
        checkInputRegex(inputs.telefon, errors.telefonError, phoneRegex)
    });

    inputs.postcode.addEventListener('change', function () {
        checkInputRegexOptional(inputs.postcode, errors.postcodeError, dkPostcodeRegex)
    });

    inputs.linkedIn.addEventListener('change', function () {
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex);
    });

    inputs.hjemmeside.addEventListener('change', function () {
        checkInputRegexOptional(inputs.hjemmeside, errors.hjemmesideError, linkRegex);
    });

    inputs.youtube_link.addEventListener('change', function () {
        checkInputRegexOptional(inputs.youtube_link, errors.youtubeError, linkRegex);
    });

    inputs.it_kompetencer.addEventListener('change', function () {
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError);
    });

    inputs.tidligere_uddannelse.addEventListener('change', function () {
        checkInputNotEmpty(inputs.tidligere_uddannelse, errors.tidligere_uddannelseError);
    });

    inputs.post_subscription.addEventListener('change', function () {
        checkEmailSubscription();
    });

    inputs.praktik.addEventListener('change', function () {
        checkEmailSubscription();
    });

    inputs.studiejob.addEventListener('change', function () {
        checkEmailSubscription();
    });

    inputs.trainee.addEventListener('change', function () {
        checkEmailSubscription();
    });

    inputs.fuldtidsjob.addEventListener('change', function () {
        checkEmailSubscription();
    });

    inputs.tilgaengelighed0.addEventListener('change', function () {
        checkTilgaengelighed();
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

function preview_cv() {
    let form_URL = '../cv/preview';
    document.getElementById("cvForm").action = form_URL;
    window.open('', 'form_target', 'width=1200 height=500');
    document.getElementById("cvForm").setAttribute("target","form_target");
    document.forms["cvForm"].submit();
    form_URL = '../cv/submit';
    document.getElementById("cvForm").action = form_URL;
    document.getElementById("cvForm").setAttribute("target","");
}

function submitButton() {
    let all_valid = true;

    let checkInputs = [
        checkInputNotEmpty(inputs.overskrift, errors.overskriftError),
        checkInputNotEmpty(inputs.uddannelse, errors.uddannelsesError),
        checkInputRegex(inputs.email, errors.emailError, emailRegex),
        checkInputNotEmpty(inputs.sprog, errors.sprogError),
        checkInputRegex(inputs.telefon, errors.telefonError, phoneRegex),
        checkInputRegexOptional(inputs.postcode, errors.postcodeError, dkPostcodeRegex),
        checkInputRegexOptional(inputs.linkedIn, errors.linkedInError, linkRegex),
        checkInputRegexOptional(inputs.hjemmeside, errors.hjemmesideError, linkRegex),
        checkInputRegexOptional(inputs.youtube_link, errors.youtubeError, linkRegex),
        checkInputNotEmpty(inputs.it_kompetencer, errors.it_kompetencerError),
        checkInputNotEmpty(inputs.tidligere_uddannelse, errors.tidligere_uddannelseError),
        checkEmailSubscription(),
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