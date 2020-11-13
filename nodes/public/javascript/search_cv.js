function filter() {

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

    var url = location.href;
    if (url.indexOf('?') > -1) {
        url = location.href.substring(0, location.href.indexOf("?sort")) + "?sort=" + query;
    } else {
        url = location.href + "?sort=" + query;
    }
    window.location.href = url;
}

function sort(attribute) {

    var url = location.href;
    if (location.href.includes("?sort=")) {
        var first = url.substring(0, url.indexOf("?sort="));
        var second = url.substring(url.indexOf("&"));
        var append = "?sort=" + attribute;
        url = first + append + second
    } else {
        url += "?sort=" + attribute;
    }

    window.location.href = url;
    
}