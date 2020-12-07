const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
const cvrRegex = /^[0-9]{8}$/
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
const cityRegex = /^[a-zA-Z æøåÆØÅ]*$/
const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
const linkRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

module.exports = { emailRegex, cvrRegex, phoneRegex, cityRegex, dateRegex, linkRegex}
