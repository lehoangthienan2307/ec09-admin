export function authAdmin(req, res, next) {
    if (req.session.auth === false) {
        return res.redirect('/')
    }
    next();
}
