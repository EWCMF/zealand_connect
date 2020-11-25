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

function addFilter(type, id) {
    var url = window.location.href;
    var param = type + '=' + id;

    if (url.indexOf('?') > -1) {
        if (url.includes(param)) {
            url = url.replace(param, "");
            if (url.substring(url.length - 1).includes('&')) {
                url = url.substring(0, url.length - 1);
            }
            if (url.substring(url.length - 1).includes('?')) {
                url = url.substring(0, url.length - 1);
            }
        } else {
            url += '&' + param
        }
    } else {
        url += '?' + param;
    }
    window.history.pushState({}, null, url);

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