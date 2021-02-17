
function changeSort(clicked, value) {
    document.getElementById("dropdownButton").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton").value = value;

    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
    
};

function changeOrder(clicked, value) {
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

function addFilter(type, id) {
    handleParameters(type, id);
    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
};

function addAddress() {
    let geo_id = document.getElementById('geo_id').value;
    let radius = document.getElementById('geo_radius').value;
    
    // Tilføj query parameter uden refresh.
    if (geo_id == '' || radius == '') {
        return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('geo_id', geo_id);
    url.searchParams.set('geo_radius', radius);
    window.history.replaceState(null, null, url);
    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
}

function removeAddress() {
    document.getElementById('inputAddress').value = '';

    document.getElementById('geo_id').value = '';
    document.getElementById('geo_radius').value = '';
    const url = new URL(window.location.href);
    if (url.searchParams.has('geo_id') && url.searchParams.has('geo_radius')) {
        url.searchParams.delete('geo_id');
        url.searchParams.delete('geo_radius');
    } else {
        return;
    }

    window.history.replaceState(null, null, url);
    removePageParam();
    let form = document.getElementById('filterForm');
    submitForm(form);
}

function handleParameters(key, value) {
    // Tilføj query parameter uden refresh.
    const url = new URL(window.location.href);
    let remove = false;
    if (url.searchParams.has(key)) {
        let values = url.searchParams.getAll(key);
        if (values.includes(value)) {
            remove = true;
        }
    }
    if (remove) {
        let values = url.searchParams.getAll(key);
        let modified = values.filter(e => e !== value);
        url.searchParams.delete(key);
        modified.forEach(element => {
            url.searchParams.append(key, element);
        });
    } else {
        url.searchParams.append(key, value);
    }
    window.history.replaceState(null, null, url);
};

function submitForm(formElement) {

    let formData = new FormData(formElement);

    let sort = document.getElementById("dropdownButton").value;
    formData.append("sort", sort);

    let order = document.getElementById("dropdownButton2").value;
    formData.append("order", order);


    let page = document.getElementById('currentPage') ? document.getElementById('currentPage').value : null;
    if (page === null || page === '') {
        page = '1'
    }
    formData.append("page", page);

    handleInputArrayAndSetToForm(formData, 'udd');
    handleInputArrayAndSetToForm(formData, 'lnd');

    var xhr = new XMLHttpRequest();
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

function handleInputArrayAndSetToForm(formData, key) {
    let array = [];
    document.getElementsByName(key).forEach(element => {
        if (element.checked) {
            array.push(element.value);
        }
    });
    if (array.length > 0) {
        formData.set(key, array);
    };
};

function animateArrow(element) {
    const children = element.children;
    
    Array.from(children).forEach(child => {
        child.classList.toggle('arrow-rotate');
    })
}

function checkCollapse(key, collapse, collapseHeader) {
    document.getElementsByName(key).forEach(element => {
        if (element.checked) {
            document.getElementById(collapse).classList.add('show');
            animateArrow(document.getElementById(collapseHeader));
            return;
        }
    });
}
checkCollapse('udd', 'collapse1', 'collapse1Header');
checkCollapse('lnd', 'collapse2', 'collapse2Header');

function checkAddressSearch() {
    const url = new URL(window.location.href);
    console.log(url.searchParams);
    if (url.searchParams.has('geo_id') && url.searchParams.has('geo_radius')) {
        let geo_id = url.searchParams.get('geo_id')
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let res = JSON.parse(xhr.responseText);

            let betegnelse = res.features[0].properties.betegnelse;
            let geo_radius = url.searchParams.get('geo_radius')
            
            document.getElementById('inputAddress').value = betegnelse;
            document.getElementById('geo_radius').value = geo_radius;
            document.getElementById('geo_id').value = geo_id;
        }
        xhr.open("GET", "https://dawa.aws.dk/adresser?id=" + geo_id + "&format=geojson", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send();
    } 
}
checkAddressSearch();

function checkCollapseSearch(id, key, collapse, collapseHeader) {
    const url = new URL(window.location.href);
    if (url.searchParams.has(key)) {
        document.getElementById(collapse).classList.add('show');
        animateArrow(document.getElementById(collapseHeader));
        document.getElementById(id).value = url.searchParams.get(key);
    }
}
checkCollapseSearch('inputAddress', 'geo_id', 'collapse3', 'collapse3Header');