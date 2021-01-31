// Autorisérer brugeren når man skal give adgang til funktioner, der kun er for specifikke roller
function authorizeUser (userRole) {
    return (req, res, next) => {
        if (req.user == null) {
            return res.status(403).render('error403', {layout: false});
        } else if (userRole === 'student' && res.locals.isStudent) {
            next();
        } else if (userRole === 'company' && res.locals.isCompany) {
            next();
        } else if (userRole === ' admin' && res.locals.isAdmin){
            next();
        } else {
            return res.status(403).render('error403', {layout: false});
        }
    };
}

module.exports = {
    authorizeUser
}
