// Autorisérer brugeren når man skal give adgang til funktioner, der kun er for specifikke roller
function authorizeUser (...permittedRoles) {
    return (req, res, next) => {
        if (req.user == null) {
            console.log(`IP address ${req.ip} requested access to unauthorized route ${req.originalUrl}`)
            return res.redirect('/login')
        } else if (permittedRoles.includes('student') && res.locals.isStudent) {
            next();
        } else if (permittedRoles.includes('company') && res.locals.isCompany) {
            next();
        } else if (permittedRoles.includes('professor') && res.locals.isProfessor) {
            next();
        } else if (permittedRoles.includes('admin') && res.locals.isAdmin){
            next();
        } else {
            console.log(`IP address ${req.ip} requested access to unauthorized route ${req.originalUrl}`)
            return res.redirect('/login')
        }
    };
}

module.exports = {
    authorizeUser
}
