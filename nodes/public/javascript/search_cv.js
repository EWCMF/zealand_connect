const { Json } = require("sequelize/types/lib/utils");

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

function changePage(page) {
    pageAsInt = parseInt(page);

}

function changeSort(clicked, value) {
    document.getElementById("dropdownButton").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton").value = value;
    var form = document.getElementById('filterForm');
    submitForm(form);
}

function changeOrder(clicked, value) {
    document.getElementById("dropdownButton2").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton2").value = value;
    var form = document.getElementById('filterForm');
    submitForm(form);
}

function newFilter() {
    var form = document.getElementById('filterForm');
    submitForm(form);
}

function submitForm(formElement) {

    var formData = new FormData(formElement);

    var sort = document.getElementById("dropdownButton").value;
    formData.append("sort", sort);

    var order = document.getElementById("dropdownButton2").value;
    formData.append("order", order);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var res = JSON.parse(xhr.responseText);
        document.getElementById('results').innerHTML = res[0] + " resultater";
        document.getElementById('cards').innerHTML = res[1];
    }
    xhr.open(formElement.method, formElement.getAttribute("action"));
    xhr.send(formData);
    return false;
}