const express = require('express');
const router = express.Router();

const pool = require('../database');
const{isLoggedIn, isNotLoggedIn, permissions}=require('../lib/auth');

router.get('/agregarOrden',  isLoggedIn, async (req, res) => {
    var areas = await pool.query('select * from areas');
    var maquinas = await pool.query('select * from maquinas');
    res.render('ordenes/agregarorden', {areas, maquinas});
    //console.log(areas);
    //console.log(maquinas);
});



router.post('/agregarOrden', isLoggedIn, async (req, res) => {
    const {area, descripcion, prioridad, estado, maquina} = req.body;
    const newOrden = {
        area,
        descripcion,
        prioridad,
        estado,
        maquina,
        user_id : req.user.id

    };
    await pool.query('INSERT INTO ordenesTrabajo set ?', [newOrden]);
    req.flash('success', 'Orden agregada correctamente');
    res.redirect('/orden');
});


router.get('/', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT * from users', [req.user.idRol]);
    const idRol= ([req.user.idRol][0]);
    //console.log(users);

    switch (idRol) {
        //Claudio
        case 5:
            const ordenes = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=0', [req.user.id]);
            res.render('ordenes/listOrden', {ordenes});
            break;
            //Andres
        case 3:
            const ordenesAceptadas = await pool.query('SELECT ordenestrabajo.*, users.fullname  FROM novared.ordenestrabajo, novared.users  where ordenestrabajo.user_id = users.id AND ordenestrabajo.idStatus=1;');
            res.render('ordenes/liderMantenimiento/listaOrdenLM', {ordenesAceptadas});
            break;
            //Tecnicos
        case 4:
            const idUser=req.user.id;
            //console.log(esteban);
            //const requests= req.body;
            //console.log(requests);
            const ordenesAsignadas = await pool.query('SELECT users.*, ordenestrabajo.*, ordenesasignadas.* FROM novared.ordenestrabajo inner join users on users.id=ordenestrabajo.user_id and ordenestrabajo.idStatus=2 inner join ordenesasignadas on ordenesasignadas.idTecnico1= ? or ordenesasignadas.idTecnico2= ? or ordenesasignadas.idAyudante1= ? or ordenesasignadas.idAyudante2= ?', [idUser, idUser, idUser, idUser]);
            res.render('ordenes/tecnico/listaOrdenT', {ordenesAsignadas});
            break;
        case 1:
            res.send("Eres Admin");
            break;
        default:
            res.send("No tienes asignado un rol");
            break;
    }


});

router.get('/delete/:id', permissions ,async (req, res) => {
    const {id} = req.params;
    //const user= await pool.query('select * from users');
    //console.log(user);
    await pool.query('DELETE FROM ordenesTrabajo where id=?', [id]);
    req.flash('error', 'Orden eliminada correctamente');
    res.redirect('/orden');
});

router.get('/edit/:id', isLoggedIn, permissions, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('SELECT * FROM ordenesTrabajo WHERE id=?', [id]);
    res.render('ordenes/edit', {orden: ordenes[0]});
});

router.get('/view/:id', isLoggedIn, permissions, async (req, res) => {
    const {id} = req.params;
    const ordenes = await pool.query('SELECT * FROM ordenesTrabajo WHERE id=?', [id]);
    res.render('ordenes/view', {orden: ordenes[0]});
});









//Revisar la bbdd

router.get('/assign/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
   //console.log(id);
    const ordenes = await pool.query('SELECT ordenestrabajo.*, users.fullname, ordenesaprobadas.comentariosSupervisor FROM novared.ordenestrabajo inner join users on users.id=ordenestrabajo.user_id and ordenestrabajo.idStatus=1 inner join ordenesaprobadas on ordenesaprobadas.idOrden= ordenestrabajo.id where ordenestrabajo.id =?', [id]);
    const fechas= await pool.query('select date_format(ordenestrabajo.fecha, "%Y-%m-%d") as fecha from ordenestrabajo where ordenestrabajo.id =?', [id]);
    const datosTecnicos = await pool.query('select fullname, id from users where idRol=4');
    const tipoMantenimientos = await pool.query('select * from tipoMantenimiento;');
    //console.log(fechas);
    //console.log(datosTecnicos);
    res.render('ordenes/liderMantenimiento/assign', {orden: ordenes[0], fecha: fechas[0], datos: datosTecnicos, tipos: tipoMantenimientos});

});


router.post('/assign/:id', isLoggedIn, async (req, res) => {
    const {idTecnico1, idTecnico2, idAyudante1, idAyudante2, tipoMantenimiento, descripcionMantenimiento, fechaHoraInicio, fechaHoraFinal, idOrden} = req.body;
    const newOrden = {
        idTecnico1,
        idTecnico2,
        idAyudante1,
        idAyudante2,
        tipoMantenimiento,
        descripcionMantenimiento,
        fechaHoraInicio,
        fechaHoraFinal,
        idUserAsigno : req.user.id,
        idOrden

    };
    console.log(newOrden);
    await pool.query('INSERT INTO ordenesasignadas set ?', [newOrden]);
    await pool.query('UPDATE ordenestrabajo SET idStatus=2 WHERE id = ?', [newOrden.idOrden]);
    req.flash('success', 'Orden Asignada correctamente');
    res.redirect('/orden');


});




router.post('/view/:id', isLoggedIn, async (req, res) => {

    const {idOrden, idUserCreo, comentariosSupervisor} = req.body;
    const newOrdenAprobada = {
        idOrden,
        idUserCreo,
        idAprobo: req.user.id,
        comentariosSupervisor
    };
    console.log(newOrdenAprobada);
    //const idOrden
    await pool.query('INSERT INTO ordenesaprobadas set ?', [newOrdenAprobada]);
    await pool.query('UPDATE ordenestrabajo SET idStatus=1 WHERE id = ?', [idOrden]);
    req.flash('success', 'Orden Aprobada correctamente');
    res.redirect('/orden');


});





router.post('/edit/:id',  async (req, res) => {
    const {id} = req.params;
    const {area, descripcion, prioridad, estado, maquina} = req.body;
    const newOrden = {
        area,
        descripcion,
        prioridad,
        estado,
        maquina
    }
    await pool.query('UPDATE ordenesTrabajo set ? WHERE id = ?', [newOrden, id]);
    req.flash('success', 'Orden actualizada correctamente');
    res.redirect('/orden');
})











module.exports = router;