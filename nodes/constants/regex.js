const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
const cvrRegex = /^[0-9]{8}$/
const phoneRegex = /^\+?(?:\h*\d){8}(?:(?:\h*\d){2})?$/
const cityRegex = /^[a-zA-Z æøåÆØÅ]*$/
const dateRegex = /^\d{4}[.\/-]\d{2}[.\/-]\d{2}$/
const linkRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
const numbersRegex = /^[0-9]{8}$/;

module.exports = { emailRegex, cvrRegex, phoneRegex, cityRegex, dateRegex, linkRegex, nameRegex, numbersRegex}
