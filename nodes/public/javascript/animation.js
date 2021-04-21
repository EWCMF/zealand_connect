function removeFadeOut(element, speed) {
    let seconds = speed/1000;
    element.style.transition = "opacity "+seconds+"s ease";

    element.style.opacity = 0;
    setTimeout(function() {
        element.parentNode.removeChild(element);
    }, speed);
}