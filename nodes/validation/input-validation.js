const { emailRegex, cvrRegex, phoneRegex, cityRegex, dkPostcodeRegex } = require('../constants/regex');

// Email skal følge et specifik format givet ved regex
function validateEmail(email){
    return emailRegex.test(email);
}

// CVR skal være præcis 8 cifre (tal)
function validateCVR(cvr){
    return cvrRegex.test(cvr);
}

// Tlf tager kun imod landekode og tal
function validatePhone(phone){
    return phoneRegex.test(phone);
}

// By tager kun imod bogstaver og mellemrum
function validateCity(city){
    return cityRegex.test(city);
}

function validatePostcode(postcode){
    return dkPostcodeRegex.test(postcode);
}

// Password skal være mellem 8 og 20 karakterer
function validatePasswordLength(password){
    return password.length > 7 && password.length < 21;
}

// CVR skal have en længde på 8
function validateCvrLength(cvr){
    return cvr.length === 8;
}

function checkForIdenticals(a, b){
    return a === b;
}

//CPR skal have en længde på 10
function validateCprLength(cpr) {
    return cpr.length === 10;
}

//regex til CPR

//fornavn og efternavn
function validateNavn(navn) {
    return navn.length >=2;
}

module.exports = {
    validateEmail, validateCVR, validatePhone, validateCity, validatePostcode, validatePasswordLength,
    validateCvrLength, checkForIdenticals, validateCprLength, validateNavn
}
