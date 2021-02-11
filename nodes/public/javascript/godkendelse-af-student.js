document.getElementById("gem").onclick = function () { submitButton() };

function submitButton() {
    let fornavn = document.getElementById("fornavn").value;
    let efternavn = document.getElementById("efternavn").value;
    let telefon = document.getElementById("telefon").value;
    let password = document.getElementById("password").value;
    let gentagPassword = document.getElementById("gentagPassword").value;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    // var emailWrittenCorrectly = emailRegex.test(email);

    let errors = [];

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
    let phoneCheck = phoneRegex.test(telefon);

    const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
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

    if (password !== ""){
        if (password.length < 8 || password.length > 20) {
            errors.push('passwordLengthError')
            document.getElementById("passwordLengthError").hidden = false;
            document.getElementById("passwordMismatchError").hidden = true;
        } else if (password !== gentagPassword){
            errors.push('passwordMismatchError')
            document.getElementById("passwordLengthError").hidden = true;
            document.getElementById("passwordMismatchError").hidden = false;
        }
        else {
            document.getElementById("passwordLengthError").hidden = true;
            document.getElementById("passwordMismatchError").hidden = true;
        }
    }

    if (errors === undefined || errors.length === 0) {
        document.forms["redigerStudentForm"].submit();
    }

}
