module.exports = {

    isLoggedIn(req, res, next) {
        // Aquí la data de entrada
        //console.log(req.user);
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/ingresar');

    },
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();

        }
        return res.redirect('/profile');
    },
    permissions(req, res, next) {
        console.log(req.user);
        if(req.user.idRol === 4 ){
            return res.redirect('/');

        }else {
            return next();

        }

        /*
        switch (req.user.idRol) {
            case 5:
                return next();
            case 4:
                return res.redirect('/');
        }

         */
    }
}