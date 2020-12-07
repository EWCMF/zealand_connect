document.getElementById("gem").onclick = function () { submitButton() };

function submitButton() {
    let fornavn = document.getElementById("fornavn").value;
    let efternavn = document.getElementById("efternavn").value;
    //let email = document.getElementById("email").value;
    let telefon = document.getElementById("telefon").value;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    // var emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const numbersRegex = /^[0-9]{8}$/;
    var numbersOnly = numbersRegex.test(telefon);

    if (fornavn == "") {
        document.getElementById("fornavnError").hidden = false;
    } else {
        document.getElementById("fornavnError").hidden = true;
    }

    if (efternavn == "") {
        document.getElementById("efternavnError").hidden = false;
    } else {
        document.getElementById("efternavnError").hidden = true;
    }

    if (!numbersOnly) {
        document.getElementById("telefonError").hidden = false;
    } else {
        document.getElementById("telefonError").hidden = true;
    }

    if (!fornavn == "" || !efternavn == "" || numbersOnly) {
        document.forms["redigerStudentForm"].submit();
    }

}