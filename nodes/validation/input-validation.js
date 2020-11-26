const { emailRegex, cvrRegex, phoneRegex, cityRegex } = require('../constants/regex');

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

// Password skal være mellem 8 og 16 karakterer
function validatePasswordLength(password){
    return password.length > 7 && password.length < 17;
}

// CVR skal have en længde på 8
function validateCvrLength(cvr){
    return cvr.length === 8;
}

function checkForIdenticals(a, b){
    return a === b;
}

module.exports = {
    validateEmail, validateCVR, validatePhone, validateCity, validatePasswordLength, validateCvrLength,
    checkForIdenticals
}
