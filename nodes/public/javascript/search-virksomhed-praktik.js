function changePage(page) { 
    document.getElementById('currentPage').value = page

    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    window.history.replaceState(null, null, url);
    let form = document.getElementById('pageForm');
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
    console.log(page);

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        let res = JSON.parse(xhr.responseText);

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

function favourite(id) {
    let xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let icon = document.getElementById("fav-icon" + id)
            if (this.responseText === "true") {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                // If we're currently in "/favourites/posts" then remove the card element from the list view. If
                // we're anywhere else then just leave the card in the view
                const path = window.location.pathname;
                if (path === "/favourites/cvs"){
                    let card = document.getElementById("card" + id)
                    removeFadeOut(card, 300)
                }
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }
    }
    xhr.open('POST', '/favourites/mark-cv-as-favourite');
    xhr.send(id);
}
