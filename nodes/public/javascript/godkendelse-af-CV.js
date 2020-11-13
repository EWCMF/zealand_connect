
document.getElementById("gem").onclick = function() {submitButton()};

function submitButton() {
    // få alle inputfelter ind i variabler
    let overskrift = document.getElementById("overskrift").value;
    let email = document.getElementById("email").value;
    let telefon = parseInt(document.getElementById("telefon").value);
    let linkedIn = document.getElementById("linkedIn").value;
    let uddannelse = document.getElementById("uddannelse").value;
    let tidligere_uddannelse = document.getElementById("tidligere-uddannelse").value;
    let sprog = document.getElementById("sprog").value;
    let iT_Kompetencer = document.getElementById("iT_Kompetencer").value;
    
    // regex her er fået fra datavalidering.test.js. Den checker at det er gyldig email. Den siger true hvis det er tilfældet
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
    var emailWrittenCorrectly = emailRegex.test(email);

    // Denne regex er checker at det kun er tal. Den er false hvis det ikke er tilfældet.
    const numbersRegex = /^[0-9]{8}$/;
    var numbersOnly = numbersRegex.test(telefon);

    const linkedInRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
    var Min_linkedIn = linkedInRegex.test(linkedIn);

    // if (overskrift == "") {
    //     document.getElementById("OverskriftError").hidden = false;
    // } else {
    //     document.getElementById("OverskriftError").hidden = true;
    // }

    // if (sprog == "") {
    //     document.getElementById("sprogError").hidden = false;
    // } else {
    //     document.getElementById("sprogError").hidden = true;
    // }

    // if (!emailWrittenCorrectly) {
    //     document.getElementById("emailError").hidden = false;
    // } else {
    //     document.getElementById("emailError").hidden = true;
    // }

    // if (!numbersOnly) {
    //     document.getElementById("telefonError").hidden = false;
    // } else {
    //     document.getElementById("telefonError").hidden = true;
    // }

    // if (!Min_linkedIn && !linkedIn == "") {
    //     document.getElementById("linkedInError").hidden = false;
    // } else {
    //     document.getElementById("linkedInError").hidden = true;
    // }

    // if (uddannelse == "") {
    //     document.getElementById("UddannelsesError").hidden = false;
    // } else {
    //     document.getElementById("UddannelsesError").hidden = true;
    // }

    // if (tidligere_uddannelse == "") {
    //     document.getElementById("Tidligere-uddannelseError").hidden = false;
    // } else {
    //     document.getElementById("Tidligere-uddannelseError").hidden = true;
    // }
    if ( Min_linkedIn || linkedIn == "") {
        if (emailWrittenCorrectly && numbersOnly && !overskrift == "" && !sprog == "" && !uddannelse == "" && !tidligere_uddannelse == "" && !iT_Kompetencer == "") {
        document.forms["cvForm"].submit();
        }
    }
}