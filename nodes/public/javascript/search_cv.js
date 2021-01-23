
function changeSort(clicked, value) {
    document.getElementById("dropdownButton").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton").value = value;
    let form = document.getElementById('filterForm');
    submitForm(form);
};

function changeOrder(clicked, value) {
    document.getElementById("dropdownButton2").innerHTML = clicked.innerHTML;
    document.getElementById("dropdownButton2").value = value;
    var form = document.getElementById('filterForm');

    const url = new URL(window.location.href);
    url.searchParams.set('order', value);
    window.history.replaceState(null, null, url);

    submitForm(form);
};

function changePage(page) { 
    document.getElementById('currentPage').value = page

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.replaceState(null, null, url);
    var form = document.getElementById('filterForm');
    submitForm(form);
};

function addFilter(type, id) {
    handleParameters(type, id);
    var form = document.getElementById('filterForm');
    submitForm(form);
};

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
        var res = JSON.parse(xhr.responseText);
        document.getElementById('results').innerHTML = res[0] + " resultater";
        document.getElementById('cards').innerHTML = res[1];
        document.getElementById('pagination').innerHTML = res[2];
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