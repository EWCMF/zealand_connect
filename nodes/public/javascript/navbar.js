
var lang = document.documentElement.lang;
document.getElementById('da').style.display = 'none';
if (lang == 'da') {
    document.getElementById('da').style.display = 'none';
    document.getElementById('en').style.display = 'block';
} else if (lang == 'en') {
    document.getElementById('en').style.display = 'none';
    document.getElementById('da').style.display = 'block';
}