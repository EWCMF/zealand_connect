document.getElementById("gem").onclick = function () { submitButton() };

function submitButton() {
    let navn = document.getElementById("navn").value;
    //let email = document.getElementById("email").value;
    let telefon = document.getElementById("tlfnr").value;
    let cvrnr = document.getElementById("cvrnr").value;
    let address = document.getElementById("address").value;
    let hjemmeside = document.getElementById("hjemmeside").value;
    let land = document.getElementById("land").value;
    let postnr = document.getElementById("postnr").value;
    let by = document.getElementById("by").value;
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    // var emailWrittenCorrectly = emailRegex.test(email);

    let numbersOnly = phoneRegex.test(telefon);
    let numbersOnly2 = numbersRegex.test(cvrnr);
    let numbersOnly3 = postcodeRegex.test(postnr);

    if (!navn) {
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

    // if (address == "") {
    //     document.getElementById("addressError").hidden = false;
    // } else {
    //     document.getElementById("addressError").hidden = true;
    // }

    // if (hjemmeside == "") {
    //     document.getElementById("hjemmesideError").hidden = false;
    // } else {
    //     document.getElementById("hjemmesideError").hidden = true;
    // }
    
    // if (land == "") {
    //     document.getElementById("landError").hidden = false;
    // } else {
    //     document.getElementById("landError").hidden = true;
    // }

    if (!by) {
        document.getElementById("byError").hidden = false;
    } else {
        document.getElementById("byError").hidden = true;
    }

    if (navn && numbersOnly && numbersOnly2 && numbersOnly3 && by) {
        document.forms["redigerVirksomhedForm"].submit();
    }

}