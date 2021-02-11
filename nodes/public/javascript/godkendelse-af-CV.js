
document.getElementById("gem").onclick = function () { submitButton() };
document.getElementById("preview").onclick = function () { preview_cv() };

function preview_cv() {
    let form_URL = '../mit-cv/preview';
    document.getElementById("cvForm").action = form_URL;
    window.open('', 'form_target', 'width=1200 height=500');
    document.getElementById("cvForm").setAttribute("target","form_target");
    document.forms["cvForm"].submit();
    form_URL = '../mit-cv/submit';
    document.getElementById("cvForm").action = form_URL;
    document.getElementById("cvForm").setAttribute("target","");
}

function submitButton() {
    // få alle inputfelter ind i variabler
    let overskrift = document.getElementById("overskrift").value;
    let email = document.getElementById("email").value;
    let telefon = parseInt(document.getElementById("telefon").value);
    let linkedIn = document.getElementById("linkedIn").value;
    let yt_link = document.getElementById("youtube_link").value;
    let uddannelse = document.getElementById("uddannelse").value;
    let tidligere_uddannelse = document.getElementById("tidligere-uddannelse").value;
    let sprog = document.getElementById("sprog").value;
    let iT_Kompetencer = document.getElementById("iT_Kompetencer").value;
    let speciale = document.getElementById("speciale").value;
    let om_mig = document.getElementById("om mig").value;
    let UogFA = document.getElementById("UogFA").value;
    let erhvervserfaring = document.getElementById("erhvervserfaring").value;
    let hjemmeside = document.getElementById("hjemmeside").value;
    let fritidsinteresser = document.getElementById("fritidsinteresser").value;

    let all_valid = true;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    let emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    let phoneCheck = phoneRegex.test(telefon);

    let Min_linkedIn = linkRegex.test(linkedIn);

    let Mit_yt_link = linkRegex.test(yt_link);

    let hjemmesideKorrekt = linkRegex.test(hjemmeside);

    if (overskrift == "") {
        all_valid = false;
        document.getElementById("OverskriftError").hidden = false;
    } else {
        document.getElementById("OverskriftError").hidden = true;
    }

    if (sprog == "") {
        all_valid = false;
        document.getElementById("sprogError").hidden = false;
    } else {
        document.getElementById("sprogError").hidden = true;
    }

    if (!emailWrittenCorrectly) {
        all_valid = false;
        document.getElementById("emailError").hidden = false;
    } else {
        document.getElementById("emailError").hidden = true;
    }

    if (!phoneCheck) {
        all_valid = false;
        document.getElementById("telefonError").hidden = false;
    } else {
        document.getElementById("telefonError").hidden = true;
    }

    if (!Min_linkedIn && linkedIn.length != 0) {
        all_valid = false;
        document.getElementById("linkedInError").hidden = false;
    } else {
        document.getElementById("linkedInError").hidden = true;
    }

    if (!Mit_yt_link && yt_link.length != 0) {
        all_valid = false;
        document.getElementById('youtubeError').hidden = false;
    } else {
        document.getElementById('youtubeError').hidden = true;
    }

    if (!hjemmesideKorrekt && hjemmeside.length != 0) {
        all_valid = false;
        document.getElementById('hjemmesideError').hidden = false;
    } else {
        document.getElementById('hjemmesideError').hidden = true;
    }

    if (uddannelse == "") {
        all_valid = false;
        document.getElementById("UddannelsesError").hidden = false;
    } else {
        document.getElementById("UddannelsesError").hidden = true;
    }

    if (tidligere_uddannelse == "") {
        all_valid = false;
        document.getElementById("Tidligere-uddannelseError").hidden = false;
    } else {
        document.getElementById("Tidligere-uddannelseError").hidden = true;
    }

    let radios = document.getElementsByClassName('tilgaengelighed');
    let tilgaengelighed = '';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            // get value, set checked flag or do whatever you need to
            tilgaengelighed = radios[i].value;
        }
    }

    if (tilgaengelighed == '') {
        all_valid = false;
        document.getElementById("tilgaengelighedError").hidden = false;
    } else {
        document.getElementById("tilgaengelighedError").hidden = true;
    }

    if (all_valid) {
        document.forms["cvForm"].submit();
    }
}


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