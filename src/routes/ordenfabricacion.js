const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, permissions} = require('../lib/auth');
const {logger} = require("browser-sync/dist/logger");
const {es} = require("timeago.js/lib/lang");
const Console = require("console");

//Rutas de admin

router.get('/agregarof', isLoggedIn, async (req, res) => {
    const userId = req.user.iduser;
    const maquinarias = await pool.query('select * from maquinaria');
    const material = await pool.query('select * from material');

    res.render('produccion/addordenfabricacion', {maquinarias, material})
});

router.post('/agregarof', isLoggedIn, permissions, async (req, res) => {
    const {idMaquinaria, idMaterial} = req.body;
    let fecha = new Date();
    let hora = fecha.getHours();
    if (hora >= 7 && hora < 19) {
        const ordenfabricacion = {
            idMaquinaria,
            idMaterial,
            idUser: req.user.iduser,
            idTurno: 1
        }
        await pool.query('INSERT INTO ordenFabricacion set ?', [ordenfabricacion]);
        req.flash('success', 'Orden de fabricacion agregada correctamente');

    } else {
        const ordenfabricacion = {
            idMaquinaria,
            idMaterial,
            idUser: req.user.iduser,
            idTurno: 2
        }
        await pool.query('INSERT INTO ordenFabricacion set ?', [ordenfabricacion]);
        req.flash('success', 'Orden de fabricacion agregada correctamente');
    }
    res.redirect('/ordenesfabricacion')

});


router.get('/ordenesfabricacion', isLoggedIn, async (req, res) => {
    const userId = req.user.iduser;
    const datosof = await pool.query('select * from datosof where iduser=? and idStatus=1', [userId]);
    res.render('produccion/ordenesfabricacion', {datosof})

});

router.get('/ordenesfabricacionTerminadas', isLoggedIn, async (req, res) => {
    const userId = req.user.iduser;
    const datosofCerradas = await pool.query('select * from datosof where iduser=? and idStatus=2', [userId]);
    res.render('produccion/operadores/ofterminadas', { datosofCerradas})

});

router.get('/ordenesfabricacioncreadas', isLoggedIn, async (req, res) => {
    const userId = req.user.iduser;
    const datosOfCreadas = await pool.query('select * from datosof where idStatus=1');
    res.render('produccion/operadores/ofCreadas', { datosOfCreadas})

});


router.get('/tipoOperador', isLoggedIn, permissions, async (req, res) => {
    const operadores = await pool.query('select * from usuario where rolusuario=5;')
    const tipoOperador = await pool.query('select * from tipoOperador');
    res.render('ordenes/paneladmin/tipooperador', {operadores, tipoOperador})
});


router.post('/edittipoOperador/', isLoggedIn, permissions, async (req, res) => {
    const {idUser, idTipoOperador} = req.body;
    //console.log(idUser, idTipoOperador);
    const idUserdb = await pool.query('select * from operador where idUsuario=?', [idUser])
    if (idUserdb.length > 0) {
        await pool.query('update operador set idtipoOperador=? where idUsuario=?;', [idTipoOperador, idUser]);
        req.flash('success', 'Operador actualizado correctamente')
    } else {
        await pool.query('insert into operador (idtipoOperador, idUsuario) values (?, ?);', [idTipoOperador, idUser]);
        req.flash('success', 'Operador Designado correctamente')
    }

    res.redirect('/tipoOperador/');
});


router.get('/detallesof/:id', permissions, isLoggedIn, async (req, res) => {
    res.render('produccion/detallesof')
});


//A partir de aquí las rutas de los tecnicos



router.get('/detallesofoperador/:id', permissions, isLoggedIn, async (req, res) => {
    const userId = req.user.iduser;
    const ordenid= req.params.id;
    const datosof = await pool.query('select * from datosof where idOrdenFabricacion=?', [ordenid]);
    const tipoPara = await pool.query('select * from tipoPara');
    const datosPara = await pool.query('select * from datosPara where idOrdenFabricacion=?', [ordenid]);
    const horasPara= await pool.query('select sec_to_time(sum(time_to_sec(horasPara))) as horasPara, idOrdenFabricacion from horasPara where idOrdenFabricacion=?', [ordenid])
    const horasOrden=await pool.query('select * from horasordenfabricacion where idOrdenFabricacion=?', [ordenid]);
    const horasOrdenT= await pool.query('select sec_to_time(sum(time_to_sec(horasOf))) as horasOrdenT, idOrdenFabricacion from horasOf where idOrdenFabricacion=?;', [ordenid]);


    //console.log(horasMaquina);
    res.render('produccion/operadores/detallesofT', {datosof:datosof[0], tipoPara, datosPara, horasPara:horasPara[0], horasOrden: horasOrden[0], horasOrdenT: horasOrdenT[0]})

});


router.post('/agregarPara', isLoggedIn, async (req, res) => {
    const {idTipoPara ,horaInicio,horaFinal, comentario, idOrdenFabricacion } = req.body;
    const horas_Para = {
        idTipoPara,
        horaInicio,
        horaFinal,
        comentario,
        idOrdenFabricacion
    };
   /*
    const horaInicios=(horaInicio).split(":");
    const horaFinals=(horaFinal).split(":");
    const h1=new Date();
    const h2=new Date();
    //console.log(h1, h2);
    h1.setHours(horaInicios[0], horaInicios[1]);
    h2.setHours(horaFinals[0], horaFinals[1]);
    h1.setHours(h1.getHours()-h2.getHours(), h1.getMinutes()-h2.getMinutes());
    console.log("La diferencia es de: " + (h1.getHours() ? h1.getHours() + (h1.getHours() > 1 ? " horas" : " hora") : "") + (h1.getMinutes() ? ", " + h1.getMinutes() + (h1.getMinutes() > 1 ? " minutos" : " minuto") : ""));

    */
    await pool.query('insert into horasParaS set ?', [horas_Para]);
    res.redirect('detallesofoperador/'+ idOrdenFabricacion)
});




router.post('/cerrarof/:id', isLoggedIn, async (req, res) => {
    const ordenid= req.params.id;

    const {idMaterial, pesoKg, horaInicio, horaFinal}=req.body;
    const data={
        idMaterial,
        pesoKg,
        horaInicio,
        horaFinal
    }
    await pool.query('insert into kgMaterial (kg, idOrdenFabricacion) values (?,?)', [pesoKg, ordenid]);
    await pool.query('insert into horasOrdenFabricacion(horaInicio, horaFinal, idOrdenFabricacion) values (?, ?, ?)',[horaInicio, horaFinal, ordenid]);
    await pool.query('update ordenFabricacion set idstatus=2 where idOrdenFabricacion=?;', [ordenid]);
    res.redirect('/detallesofoperador/'+ordenid)
});


router.post('/ayudanteof', isLoggedIn, async (req, res) => {
    console.log(req.body)
    res.redirect('/detallesof/')
});

module.exports = router;