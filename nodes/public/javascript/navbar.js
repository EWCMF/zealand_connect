
var lang = document.documentElement.lang;
document.getElementById('da').style.display = 'none';
if (lang == 'da') {
    document.getElementById('da').style.display = 'none';
    document.getElementById('en').style.display = 'block';
} else if (lang == 'en') {
    document.getElementById('en').style.display = 'none';
    document.getElementById('da').style.display = 'block';
}

//send get request til login route for at spørge om man er logget ind, render login knap hvis man ikke er logget ud, 
// ellers render logud knap hvis man er logget ind
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        //hvis brugeren ikke er logget ind, så returnere kaldet undefined eller en email
        let responseObject = JSON.parse(this.responseText)

        if (responseObject.email === '') {
            document.getElementById("logud").style.display = 'none';
            document.getElementById("login").style.display = 'block';

            document.getElementById("profileDropdown").style.display = 'none';
            document.getElementById("ikkeLoggedeInd").style.display = 'block';
        } else {
            document.getElementById("login").style.display = 'none';
            document.getElementById("logud").style.display = 'block';

            document.getElementById("ikkeLoggedeInd").style.display = 'none';
            document.getElementById("profileDropdown").style.display = 'block';
            

            if (responseObject.cvrnr == null) {
                document.getElementById('cv').style.display = 'block';
                document.getElementById('praktik').style.display = 'none';
                document.getElementById("profileDropdownName").innerHTML = responseObject.fornavn + " " + responseObject.efternavn;
            } else {
                document.getElementById('cv').style.display = 'none';
                document.getElementById('praktik').style.display = 'block';
                document.getElementById('lav_praktik').style.display = 'block';
                document.getElementById("profileDropdownName").innerHTML = responseObject.navn;
                
            }
        }

    }
};
xhttp.open("GET", "/profil/getUser", true);
xhttp.send();