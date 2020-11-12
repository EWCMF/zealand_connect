
function reload() {
    
    var query = "";
    var sort = document.getElementById("dropdownButton").value;
    query += sort;
    if (document.getElementById("datamatiker").checked) {
        query += "&uddannelse=Datamatiker"
    }
    if (document.getElementById("handelsøkonom").checked) {
        query += "&uddannelse=Handelsøkonom"
    }
    if (document.getElementById("finansøkonom").checked) {
        query += "&uddannelse=Finansøkonom"
    }
    if (document.getElementById("ihom").checked) {
        query += "&uddannelse=International Handel og Markedsføring"
    }
    if (document.getElementById("ioe").checked) {
        query += "&uddannelse=Innovation og Entrepreneurship"
    }
    if (document.getElementById("bygningskontruktør").checked) {
        query += "&uddannelse=Bygningskontruktør"
    }
    if (document.getElementById("byggetekniker").checked) {
        query += "&uddannelse=Byggetekniker"
    }
    if (document.getElementById("installatør").checked) {
        query += "&uddannelse=Installatør, stærkstrøm"
    }

    window.location.href = 'http://localhost:3000/mit-CV/search?sort=' + query;
}