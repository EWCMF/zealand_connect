
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

    if (!numbersOnly) {
        alert("False");
    }


    // if(overskrift != null) {
    // console.log(overskrift)
    // }
    // if(studieretning != null) {
    // console.log(studieretning)
    // }
    // if(email != null) { 
    // console.log(email)
    // }
    // if(telefon != null) { 
    // console.log(telefon)
    // }
    // if(hjemmeside != null) { 
    // console.log(hjemmeside)
    // }
    // if(omMig != null) { 
    // console.log(omMig)
    // }
    // if(arbejdserfaring != null) { 
    // console.log(arbejdserfaring)
    // }
    // if(uddannelse != null) { 
    // console.log(uddannelse)
    // }
    // if(hobby != null) {
    // console.log(hobby)
    // }
    // alert("it works")

    
}