// Autorisérer brugeren når man skal give adgang til funktioner, der kun er for specifikke roller
function authorizeUser(req, res, userRole) {
    if (req.user == null) {
        return false;
    } else if (userRole === 'student' && res.locals.isStudent) {
        return true;
    } else if (userRole === 'company' && res.locals.isCompany) {
        return true;
    } else if (userRole === ' admin' && res.locals.isAdmin){
        return true;
    } else {
        return false;
    }
}

module.exports = {
    authorizeUser
}
