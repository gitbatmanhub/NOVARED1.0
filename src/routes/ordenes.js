const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, isNotLoggedIn, permissions} = require('../lib/auth');
const assert = require("assert");



//=======================================================Home

router.get('/', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT * from users', [req.user.idRol]);
    const idRol = ([req.user.idRol][0]);


    switch (idRol) {
        //Claudio
        case 5:
            const ordenes = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=0', [req.user.id]);
            res.render('ordenes/listOrden', {ordenes});


            break;
        //Andres
        case 3:
            const ordenesA = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=0', [req.user.id]);
            const contadorA = await pool.query('SELECT Count(idStatus) as contador from ordenestrabajo where idStatus=0');
            const ordenesAs = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=2', [req.user.id]);
            const contadorAs = await pool.query('SELECT Count(idStatus) as contador from ordenestrabajo where idStatus=2');
            const ordenesAt = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=3', [req.user.id]);
            const contadorAt = await pool.query('SELECT Count(idStatus) as contador from ordenestrabajo where idStatus=3');
            res.render('ordenes/liderMantenimiento/listaOrdenLM', {
                ordenesA,
                contadorA: contadorA[0],
                ordenesAs,
                contadorAs: contadorAs[0],
                ordenesAt,
                contadorAt: contadorAt[0]
            });

            // console.log(contadorA);
            break;
        //Tecnicos
        case 4:
            const idUser = req.user.id;


            const ordenesAsignadas = await pool.query('select  ordenesasignadas.*, o.* , u.fullname from  novared.ordenesasignadas inner join ordenestrabajo o on ordenesasignadas.idOrden = o.id inner join users u on o.user_id = u.id where (idAyudante1= ? or idTecnico2= ? or idTecnico1= ? or idAyudante2=?) and o.idStatus=2', [idUser, idUser, idUser, idUser]);
            const ordenesAtendidas = await pool.query('select  ordenesasignadas.*, o.* , u.fullname from  novared.ordenesasignadas inner join ordenestrabajo o on ordenesasignadas.idOrden = o.id inner join users u on o.user_id = u.id where (idAyudante1= ? or idTecnico2= ? or idTecnico1= ? or idAyudante2=?) and o.idStatus=3;', [idUser, idUser, idUser, idUser]);
            const contadorAsignadas = await pool.query('select  count(ordenesasignadas.id_OrAs) as contador from  novared.ordenesasignadas inner join ordenestrabajo o on ordenesasignadas.idOrden = o.id inner join users u on o.user_id = u.id where (idAyudante1= ? or idTecnico2= ? or idTecnico1= ? or idAyudante2=?) and o.idStatus=2;',[idUser, idUser, idUser, idUser]);
            const contadorAtendidas = await pool.query('select  count(ordenesasignadas.id_OrAs) as contador from  novared.ordenesasignadas inner join ordenestrabajo o on ordenesasignadas.idOrden = o.id inner join users u on o.user_id = u.id where (idAyudante1= ? or idTecnico2= ? or idTecnico1= ? or idAyudante2=?) and o.idStatus=3;',[idUser, idUser, idUser, idUser]);
            res.render('ordenes/tecnico/listaOrdenT', {
                ordenesAsignadas,
                ordenesAtendidas,
                contadorAtendidas:contadorAtendidas[0],
                contadorAsignadas:contadorAsignadas[0]
            });
            break;
        case 1:
            res.send("Eres Admin");
            break;
        default:
            res.send("No tienes asignado un rol");
            break;
    }


});
//====================================================





//======================================= Agregar Orden
router.get('/agregarOrden', isLoggedIn, async (req, res) => {
    var areas = await pool.query('select * from areas');
    var maquinas = await pool.query('select * from maquinas');
    res.render('ordenes/agregarorden', {areas, maquinas});

});



//====================================Recibir Datos de la Orden
router.post('/agregarOrden', isLoggedIn, async (req, res) => {
    const {area, descripcion, prioridad, estado, maquina, estadoMaquina} = req.body;
    const newOrden = {
        area,
        descripcion,
        prioridad,
        estado,
        maquina,
        user_id: req.user.id,
        estadoMaquina

    };
    await pool.query('INSERT INTO ordenesTrabajo set ?', [newOrden]);
    req.flash('success', 'Orden agregada correctamente');
    res.redirect('/orden');
});
//=========================================================



//=============================================Borrar Ordenes
router.get('/delete/:id', permissions, async (req, res) => {
    const {id} = req.params;

    await pool.query('DELETE FROM ordenesTrabajo where id=?', [id]);
    req.flash('error', 'Orden eliminada correctamente');
    res.redirect('/orden');
});
//=========================================================


//=============================================Editar Ordenes
router.get('/edit/:id', isLoggedIn, permissions, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('select ordenestrabajo.*, users.fullname, e.nameEstado from ordenestrabajo join users on users.id = ? join estadomaquina e on e.idEstadoMaquina = ordenestrabajo.estadoMaquina;', [req.user.id]);
    const maquinas = await pool.query('select * from maquinas');
    const areas = await pool.query('select * from areas');
    //console.log(maquinas)
    res.render('ordenes/edit', {
        orden: ordenes[0],
        maquinas: maquinas,
        areas: areas
    });
});
//================================================


//=============================================Ver Ordenes
router.get('/view/:id', isLoggedIn, permissions, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('select ordenestrabajo.*, users.fullname, e.nameEstado from ordenestrabajo join users on users.id = ? join estadomaquina e on e.idEstadoMaquina = ordenestrabajo.estadoMaquina;', [req.user.id]);
    //const ordenesA = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=1', [req.user.id]);

    //console.log(ordenes);
    res.render('ordenes/view', {orden: ordenes[0]/*, ordenesA*/});
});
//================================================


//=============================================Asignar Ordenes
router.get('/assign/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=0', [req.user.id]);
    const fechas = await pool.query('select date_format(ordenestrabajo.fecha, "%Y-%m-%d") as fecha from ordenestrabajo where ordenestrabajo.id =?', [id]);
    const datosTecnicos = await pool.query('select fullname, id from users where idRol=4');
    const tipoMantenimientos = await pool.query('select * from tipoMantenimiento;');

    res.render('ordenes/liderMantenimiento/assign', {
        orden: ordenes[0],
        fecha: fechas[0],
        datos: datosTecnicos,
        tipos: tipoMantenimientos
    });

});
//================================================


//=============================================Ver Ordenes Tecnicos
router.get('/review/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('select ordenesasignadas.*, ot.*, u.fullname from novared.ordenesasignadas inner join ordenestrabajo ot on ordenesasignadas.idOrden = ot.id inner join users u on ot.user_id = u.id where idOrden=?;', [id]);

    const fechas = await pool.query('select date_format(ordenestrabajo.fecha, "%Y-%m-%d") as fecha from ordenestrabajo where ordenestrabajo.id =?', [id]);
    const ayudante1 = await pool.query('SELECT fullname as ayudante1 FROM novared.ordenesasignadas inner join users u on ordenesasignadas.idAyudante1 = u.id where idOrden=?', [id]);
    const ayudante2 = await pool.query('SELECT fullname as ayudante2 FROM novared.ordenesasignadas inner join users u on ordenesasignadas.idAyudante2 = u.id where idOrden=?', [id]);
    const tecnico1 = await pool.query('SELECT fullname as tecnico1 FROM novared.ordenesasignadas inner join users u on ordenesasignadas.idTecnico1 = u.id where idOrden=?', [id]);
    const tecnico2 = await pool.query('SELECT fullname as tecnico2 FROM novared.ordenesasignadas inner join users u on ordenesasignadas.idTecnico2 = u.id where idOrden=?', [id]);
    const datosAdicionales = await pool.query('select nameTipoMantenimiento ,descripcionMantenimiento, date_format(ordenesasignadas.fechaHoraInicio, "%Y-%m-%d") as fechaInicio, date_format(ordenesasignadas.fechaHoraInicio, "%H:%m") as horaInicio,date_format(ordenesasignadas.fechaHoraFinal, "%H:%m") as horaFinal , date_format(ordenesasignadas.fechaHoraFinal, "%Y-%m-%d") as fechaFinal from novared.ordenesasignadas inner join tipomantenimiento t on ordenesasignadas.tipoMantenimiento = t.idTipoMantenimiento where idOrden=?;', [id]);

    res.render('ordenes/tecnico/viewT', {
        orden: ordenes[0],
        fecha: fechas[0],
        ayudante1: ayudante1[0],
        ayudante2: ayudante2[0],
        tecnico1: tecnico1[0],
        tecnico2: tecnico2[0],
        datosAdicionales: datosAdicionales[0]


    });

});
//================================================



//============================================== Asignar Ordenes
router.post('/assign/:id', isLoggedIn, async (req, res) => {
    const {
        idTecnico1,
        idTecnico2,
        idAyudante1,
        idAyudante2,
        tipoMantenimiento,
        descripcionMantenimiento,
        fechaHoraInicio,
        fechaHoraFinal,
        idOrden
    } = req.body;
    const newOrden = {
        idTecnico1,
        idTecnico2,
        idAyudante1,
        idAyudante2,
        tipoMantenimiento,
        descripcionMantenimiento,
        fechaHoraInicio,
        fechaHoraFinal,
        idUserAsigno: req.user.id,
        idOrden

    };
    await pool.query('INSERT INTO ordenesasignadas set ?', [newOrden]);
    await pool.query('UPDATE ordenestrabajo SET idStatus=2 WHERE id = ?', [newOrden.idOrden]);
    req.flash('success', 'Orden Asignada correctamente');
    res.redirect('/orden');


});
//================================================


//============================================== Aprobar Ordenes
router.post('/view/:id', isLoggedIn, async (req, res) => {
    const {idOrden, idUserCreo, comentariosSupervisor} = req.body;
    const newOrdenAprobada = {
        idOrden,
        idUserCreo,
        idAprobo: req.user.id,
        comentariosSupervisor
    };

    await pool.query('INSERT INTO ordenesaprobadas set ?', [newOrdenAprobada]);
    await pool.query('UPDATE ordenestrabajo SET idStatus=1 WHERE id = ?', [idOrden]);
    req.flash('success', 'Orden Aprobada correctamente');
    res.redirect('/orden');


});
//=======================================================

//=============================================== Vista Ordenes Tecnicos
router.post('/viewT/:id', isLoggedIn, async (req, res) => {

    const {comentariosTecnico, id_orden} = req.body;
    const newOrdenAtendida = {
        user_id: req.user.id,
        comentariosTecnico,
        id_orden
    };


    await pool.query('INSERT INTO ordenesatendidas set ?', [newOrdenAtendida]);
    await pool.query('UPDATE ordenestrabajo SET idStatus=3 WHERE id = ?', [newOrdenAtendida.id_orden]);
    req.flash('success', 'Orden atendida correctamente');


    res.redirect('/orden');


});
//=======================================================



//=============================================== Editar Ordenes Recepci??n Datos
router.post('/edit/:id', async (req, res) => {

    const {id} = req.params;
    const {area, descripcion, prioridad, estado, maquina, estadoMaquina} = req.body;
    const newOrden = {
        area,
        descripcion,
        prioridad,
        estado,
        maquina,
        estadoMaquina
    }

    //console.log(id);
    //console.log(newOrden);
    await pool.query('UPDATE ordenesTrabajo set ? WHERE id = ?', [newOrden, id]);
    req.flash('success', 'Orden actualizada correctamente');
    res.redirect('/orden');
})
//=======================================================

router.get('/probe', (req, res) => {
    const {id} = req.params;
    res.render('ordenes/probe');
});


router.post('/probe/',isLoggedIn, (req, res )=>{
    const obj = Object.assign({},req.body)
    console.log(obj);
    req.flash('success', 'Nombre y apellidos');
    res.redirect('/');


});

module.exports = router;