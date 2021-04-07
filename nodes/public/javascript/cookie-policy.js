let acc = document.getElementsByClassName("cookie-accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        togglePanel(this)
        for (let j = 0; j < acc.length; j++) {
            if (acc[j] !== this){
                closePanel(acc[j])
            }
        }
    });
}

function togglePanel(element){
    element.classList.toggle("active-cookie-accordion");
    let panel = element.nextElementSibling;
    let chevron = element.children[1];
    if (panel.style.display === "block") {
        panel.style.display = "none";
        chevron.classList.remove("chevron-white")
    } else {
        panel.style.display = "block";
        chevron.classList.add("chevron-white")
    }
}

function closePanel(element){
    element.classList.remove("active-cookie-accordion");
    let panel = element.nextElementSibling;
    let chevron = element.children[1];
    panel.style.display = "none";
    chevron.classList.remove("chevron-white");
}