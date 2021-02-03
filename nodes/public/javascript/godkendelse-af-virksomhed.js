document.getElementById("gem").onclick = function () { submitButton() };

function submitButton() {
    let navn = document.getElementById("navn").value;
    //let email = document.getElementById("email").value;
    let telefon = document.getElementById("telefon").value;
    let cvrnr = document.getElementById("cvrnr").value;
    let address = document.getElementById("address").value;
    let hjemmeside = document.getElementById("hjemmeside").value;
    let direktoer = document.getElementById("direktoer").value;
    let land = document.getElementById("land").value;
    let postnr = document.getElementById("postnr").value;
    let by = document.getElementById("by").value;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    // var emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const numbersRegex = /^[0-9]{8}$/;
    const numbersRegex2 = /^[0-9]{4}$/;
    var numbersOnly = numbersRegex.test(telefon);
    var numbersOnly2 = numbersRegex.test(cvrnr);
    var numbersOnly3 = numbersRegex2.test(postnr);

    if (navn == "") {
        document.getElementById("navnError").hidden = false;
    } else {
        document.getElementById("navnError").hidden = true;
    }
    if (!numbersOnly) {
        document.getElementById("telefonError").hidden = false;
    } else {
        document.getElementById("telefonError").hidden = true;
    }

    if (!numbersOnly2) {
        document.getElementById("cvrnrError").hidden = false;
    } else {
        document.getElementById("cvrnrError").hidden = true;
    }
    if (!numbersOnly3) {
        document.getElementById("postnrError").hidden = false;
    } else {
        document.getElementById("postnrError").hidden = true;
    }

    if (address == "") {
        document.getElementById("addressError").hidden = false;
    } else {
        document.getElementById("addressError").hidden = true;
    }

    // if (hjemmeside == "") {
    //     document.getElementById("hjemmesideError").hidden = false;
    // } else {
    //     document.getElementById("hjemmesideError").hidden = true;
    // }

    // if (direktoer == "") {
    //     document.getElementById("direktoerError").hidden = false;
    // } else {
    //     document.getElementById("direktoerError").hidden = true;
    // }
    
    // if (land == "") {
    //     document.getElementById("landError").hidden = false;
    // } else {
    //     document.getElementById("landError").hidden = true;
    // }

    if (by == "") {
        document.getElementById("byError").hidden = false;
    } else {
        document.getElementById("byError").hidden = true;
    }

    if (!navn == "" && numbersOnly2 && !address == "" && numbersOnly3 && !by == "") {
        document.forms["redigerVirksomhedForm"].submit();
    }

}