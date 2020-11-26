const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/
const cvrRegex = /^[0-9]{8}$/
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
const cityRegex = /^[a-zA-Z ]*$/
const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
const linkRegex = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+).[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$/

module.exports = { emailRegex, cvrRegex, phoneRegex, cityRegex, dateRegex, linkRegex}
