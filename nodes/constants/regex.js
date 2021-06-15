// Ændringer her skal også gentages i frontend regex'erne
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
const cvrRegex = /^[0-9]{8}$/
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
const cityRegex = /^[a-zA-Z æøåÆØÅ]*$/
const dateRegex = /^\d{4}[.\/-]\d{2}[.\/-]\d{2}$/
const linkRegex = /^(https?:\/\/|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?$/i
const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const numbersRegex = /^[0-9]{8}$/;
const postcodeRegex = /^[0-9]{4}$/;

module.exports = { emailRegex, cvrRegex, phoneRegex, cityRegex, dateRegex, linkRegex, nameRegex, numbersRegex, postcodeRegex}
