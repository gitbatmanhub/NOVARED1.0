module.exports = {
//Saber si está logeado
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
    }
    //Permisos a ciertas personas por roles
    ,
    permissions(req, res, next) {
        const rolusuario = req.user.rolusuario;
        if (rolusuario === 4 && rolusuario === 3) {
            return res.redirect('/');

        } else {
            return next();

        }
    },
    operador(req, res, next) {
        const rolusuario = req.user.rolusuario;
        if (rolusuario ===5) {
            return next();
        } else {
            return res.redirect('/');
        }
    },
    supervisorOperador(req, res, next){
        const rolusuario = req.user.rolusuario;
        if (rolusuario ===5) {
            return next();
        } else {
            return res.redirect('/');
        }
    }
    ,
    tecnico(req, res, next){
        const rolusuario = req.user.rolusuario;
        if (rolusuario ===4) {
            return next();
        } else {
            return res.redirect('/');
        }
    }


}