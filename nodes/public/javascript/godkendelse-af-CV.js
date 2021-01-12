
document.getElementById("gem").onclick = function () { submitButton() };
document.getElementById("preview").onclick = function () { preview_cv() };

function preview_cv() {
var form_URL = '../mit-cv/Preview'
document.getElementById("cvForm").action = form_URL;
window.open('', 'form_target', 'width=1200 height=500');
document.getElementById("cvForm").setAttribute("target","form_target")
document.forms["cvForm"].submit()
var form_URL = '../mit-cv/submit'
document.getElementById("cvForm").action = form_URL;
document.getElementById("cvForm").setAttribute("target","")
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

    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    var emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const numbersRegex = /^[0-9]{8}$/;
    var numbersOnly = numbersRegex.test(telefon);

    const linkedInRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
    var Min_linkedIn = linkedInRegex.test(linkedIn);

    var Mit_yt_link = linkedInRegex.test(yt_link);

    if (overskrift == "") {
        document.getElementById("OverskriftError").hidden = false;
    } else {
        document.getElementById("OverskriftError").hidden = true;
    }

    if (sprog == "") {
        document.getElementById("sprogError").hidden = false;
    } else {
        document.getElementById("sprogError").hidden = true;
    }

    if (!emailWrittenCorrectly) {
        document.getElementById("emailError").hidden = false;
    } else {
        document.getElementById("emailError").hidden = true;
    }

    if (!numbersOnly) {
        document.getElementById("telefonError").hidden = false;
    } else {
        document.getElementById("telefonError").hidden = true;
    }

    if (!Min_linkedIn && !linkedIn == "") {
        document.getElementById("linkedInError").hidden = false;
    } else {
        document.getElementById("linkedInError").hidden = true;
    }

    if (uddannelse == "") {
        document.getElementById("UddannelsesError").hidden = false;
    } else {
        document.getElementById("UddannelsesError").hidden = true;
    }

    if (tidligere_uddannelse == "") {
        document.getElementById("Tidligere-uddannelseError").hidden = false;
    } else {
        document.getElementById("Tidligere-uddannelseError").hidden = true;
    }
    
    // if (linkedIn == "") {
    //     document.getElementById("linkedIn").value = 'Intet angivet';
    // }

    // if (yt_link == "") {
    //     document.getElementById("youtube_link").value = 'Intet angivet';
    // }

    // if (speciale == "") {
    //     document.getElementById("speciale").value = 'Intet angivet';
    // }

    // if (om_mig == "") {
    //     document.getElementById("om mig").value = 'Intet angivet';
    // }

    // if (UogFA == "") {
    //     document.getElementById("UogFA").value = 'Intet angivet';
    // }

    // if (erhvervserfaring == "") {
    //     document.getElementById("erhvervserfaring").value = 'Intet angivet';
    // }

    // if (hjemmeside == "") {
    //     document.getElementById("hjemmeside").value = 'Intet angivet';
    // }

    // if (fritidsinteresser == "") {
    //     document.getElementById("fritidsinteresser").value = 'Intet angivet';
    // }

    if (emailWrittenCorrectly && numbersOnly && !overskrift == "" && !sprog == "" && !uddannelse == "" && !tidligere_uddannelse == "" && !iT_Kompetencer == "") {
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