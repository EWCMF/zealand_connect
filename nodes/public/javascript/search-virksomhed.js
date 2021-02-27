
function changeSort(clicked, value) {
    document.getElementById('dropdownButton').dataset.key = clicked.innerHTML;
    document.getElementById("dropdownButton").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton").value = value;

    const url = new URL(window.location.href);
    url.searchParams.set('sort', value);
    window.history.replaceState(null, null, url);

    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
    
};

function changeOrder(clicked, value) {
    document.getElementById('dropdownButton2').dataset.key = clicked.innerHTML;
    document.getElementById("dropdownButton2").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton2").value = value;

    const url = new URL(window.location.href);
    url.searchParams.set('order', value);
    window.history.replaceState(null, null, url);

    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
};


function changePage(page) { 
    document.getElementById('currentPage').value = page

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.replaceState(null, null, url);
    let form = document.getElementById('filterForm');
    submitForm(form);
};

function removePageParam() {
    const url = new URL(window.location.href);
    if (url.searchParams.has('page')) {
        url.searchParams.delete('page');
        window.history.replaceState(null, null, url);
    }
}

function submitForm(formElement) {

    let formData = new FormData(formElement);
    
    let page = document.getElementById('currentPage') ? document.getElementById('currentPage').value : null;
    if (page === null || page === '') {
        page = '1'
    }
    formData.append("page", page);

    let sort = document.getElementById('dropdownButton').value;
    formData.append("sort", sort);

    let order = document.getElementById('dropdownButton2').value;
    formData.append("order", order);
    

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        let res = JSON.parse(xhr.responseText);

        document.getElementById('results').innerHTML = res[0] + "&nbsp;";

        let cardFragment = document.createRange().createContextualFragment(res[1]);
        let paginationFragment = document.createRange().createContextualFragment(res[2]);

        let cards = document.getElementById('cards');
        let pagination = document.getElementById('pagination');

        let newCards = cards.cloneNode();
        newCards.innerHTML = "";
        newCards.appendChild(cardFragment);
        cards.parentNode.replaceChild(newCards, cards);

        let newPagination = pagination.cloneNode();
        newPagination.innerHTML = "";
        newPagination.appendChild(paginationFragment);
        pagination.parentNode.replaceChild(newPagination, pagination);

        let lang = document.documentElement.lang;
        brugStrings(lang);
    }
    xhr.open(formElement.method, formElement.getAttribute("action"));
    xhr.send(formData);
    return false;
};

function checkSortAndOrder() {
    const url = new URL(window.location.href);
    const valueToInnerHTML = {
        "da": {
            "navn": "Navn",
            "updatedAt": "Senest opdateret",
            "ASC": "Stigende",
            "DESC": "Faldende"
        },
        "en": {
            "navn": "Name",
            "updatedAt": "Recently updated",
            "ASC": "Ascending",
            "DESC": "Descending"
        }
        
    }
    let lang = document.documentElement.lang == "en" ? "en" : "da";
    
    if (url.searchParams.has('sort')) {
        let param = url.searchParams.get('sort');
        if (valueToInnerHTML[lang].hasOwnProperty(param)) {
            document.getElementById('dropdownButton').dataset.key = valueToInnerHTML[lang][param];
            document.getElementById('dropdownButton').innerHTML = valueToInnerHTML[lang][param];
        }
        document.getElementById('dropdownButton').value = url.searchParams.get('sort');
    }
    if (url.searchParams.has('order')) {
        let param = url.searchParams.get('order');
        if (valueToInnerHTML[lang].hasOwnProperty(param)) {
            document.getElementById('dropdownButton2').dataset.key = valueToInnerHTML[lang][param];
            document.getElementById('dropdownButton2').innerHTML = valueToInnerHTML[lang][param];
        }
        document.getElementById('dropdownButton2').value = url.searchParams.get('order');
    }
}
checkSortAndOrder();

