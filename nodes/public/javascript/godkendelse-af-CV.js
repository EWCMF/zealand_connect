
document.getElementById("gem").onclick = function() {submitButton()};

function submitButton() {
    // få alle inputfelter ind i variabler
    let overskrift = document.getElementById("overskrift").value;
    let studieretning = document.getElementById("studieretning").value;
    let email = document.getElementById("email").value;
    let telefon = parseInt(document.getElementById("telefon").value);
    let hjemmeside = document.getElementById("hjemmeside").value;
    let omMig = document.getElementById("om mig").value;
    let arbejdserfaring = document.getElementById("arbejdserfaring").value;
    let uddannelse = document.getElementById("uddannelse").value;
    let hobby = document.getElementById("hobby").value;
    
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    var emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const numbersRegex = /^[0-9]{8}$/;
    var numbersOnly = numbersRegex.test(telefon);

    const homepageRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
    var homepage = homepageRegex.test(hjemmeside);

    if (overskrift == "") {
        document.getElementById("OverskriftError").hidden = false;
    } else {
        document.getElementById("OverskriftError").hidden = true;
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

    if (!homepage) {
        document.getElementById("homepageError").hidden = false;
    } else {
        document.getElementById("homepageError").hidden = true;
    }

    if (omMig == "") {
        document.getElementById("OmMigError").hidden = false;
    } else {
        document.getElementById("OmMigError").hidden = true;
    }

    if (arbejdserfaring == "") {
        document.getElementById("ArbejdserfaringError").hidden = false;
    } else {
        document.getElementById("ArbejdserfaringError").hidden = true;
    }

    if (uddannelse == "") {
        document.getElementById("UddanelsesError").hidden = false;
    } else {
        document.getElementById("UddanelsesError").hidden = true;
    }

    if (emailWrittenCorrectly && numbersOnly && !overskrift == "" && !omMig == "" && !arbejdserfaring == "" && !uddannelse == "") {
     document.forms["cvForm"].submit()
    }
}