document.getElementById("gem").onclick = function () { submitButton() };

function submitButton() {
    let fornavn = document.getElementById("fornavn").value;
    let efternavn = document.getElementById("efternavn").value;
    let telefon = document.getElementById("telefon").value;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    // var emailWrittenCorrectly = emailRegex.test(email);

    let errors = [];

    let phoneCheck = phoneRegex.test(telefon);

    let testFornavn = nameRegex.test(fornavn);
    let testEfternavn =nameRegex.test(efternavn);

    if (fornavn === ""){
        errors.push('fornavnInvalidError');
        document.getElementById("fornavnLengthError").hidden = false;
        document.getElementById("fornavnInvalidError").hidden = true;
    }
    else if (!testFornavn) {
        errors.push('fornavnInvalidError');
        document.getElementById("fornavnInvalidError").hidden = false;
        document.getElementById("fornavnLengthError").hidden = true;

    } else {
        document.getElementById("fornavnInvalidError").hidden = true;
    }

    if (efternavn === "") {
        errors.push('EfternavnLengthError');
        document.getElementById("efternavnLengthError").hidden = false;
        document.getElementById("efternavnInvalidError").hidden = true;
    } else if (!testEfternavn){
        errors.push('EfternavnInvalidError');
        document.getElementById("efternavnInvalidError").hidden = false;
        document.getElementById("efternavnLengthError").hidden = true;
    }
    else {
        document.getElementById("efternavnLengthError").hidden = true;
        document.getElementById("efternavnInvalidError").hidden = true;
    }

    if (!phoneCheck) {
        errors.push('telefonError');
        document.getElementById("telefonError").hidden = false;
    } else {
        document.getElementById("telefonError").hidden = true;
    }

    if (errors === undefined || errors.length === 0) {
        document.forms["redigerStudentForm"].submit();
    }

}
