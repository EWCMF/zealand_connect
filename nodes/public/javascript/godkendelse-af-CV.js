
document.getElementById("submit").onclick = function() {submitButton()};

function submitButton() {
    let overskrift = document.getElementById("overskrift").value;
    let studieretning = document.getElementById("studieretning").value;
    let email = document.getElementById("email").value;
    let telefon = parseInt(document.getElementById("telefon").value);
    let hjemmeside = document.getElementById("hjemmeside").value;
    let omMig = document.getElementById("om mig").value;
    let arbejdserfaring = document.getElementById("arbejdserfaring").value;
    let uddannelse = document.getElementById("uddannelse").value;
    let hobby = document.getElementById("hobby").value;
    if(overskrift != null) {
    console.log(overskrift)
    }
    if(studieretning != null) {
    console.log(studieretning)
    }
    if(email != null) { 
    console.log(email)
    }
    if(telefon != null) { 
    console.log(telefon)
    }
    if(hjemmeside != null) { 
    console.log(hjemmeside)
    }
    if(omMig != null) { 
    console.log(omMig)
    }
    if(arbejdserfaring != null) { 
    console.log(arbejdserfaring)
    }
    if(uddannelse != null) { 
    console.log(uddannelse)
    }
    if(hobby != null) {
    console.log(hobby)
    }
    alert("it works")
}