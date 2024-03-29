const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn, permissions, operador, digitador} = require('../lib/auth');
const {ca} = require("timeago.js/lib/lang");


//Rutas de admin




router.get('/agregarof', isLoggedIn, operador, async (req, res) => {
    const maquinarias = await pool.query('select * from maquinaria');
    const material = await pool.query('select * from material');
    res.render('produccion/addordenfabricacion', {maquinarias, material})
});


router.post('/agregarof', isLoggedIn, operador, async (req, res) => {

    const {idMaquinaria, idMaterial} = req.body;
    let fecha = new Date();
    let hora = fecha.getHours();
    if (hora >= 7 && hora < 19) {
        const ordenfabricacion = {
            idMaquinaria,
            idMaterial,
            idUser: req.user.iduser,
            idTurno: 1,
            idProceso:11
        }
        await pool.query("SET time_zone = '-05:00'");
        await pool.query('INSERT INTO ordenFabricacion set ? ', [ordenfabricacion]);
    } else {
        const ordenfabricacion = {
            idMaquinaria,
            idMaterial,
            idUser: req.user.iduser,
            idTurno: 2,
            idProceso:11
        }
        await pool.query("SET time_zone = '-05:00'");
        await pool.query('INSERT INTO ordenFabricacion set ?', [ordenfabricacion]);
        req.flash('success', 'Orden de fabricacion agregada correctamente');
    }
    const id = await pool.query('SELECT idOrdenFabricacion FROM ordenFabricacion where idUser=? and date_format(create_at, "%Y-%m-%d")=curdate() ORDER BY idOrdenFabricacion DESC LIMIT 1;', [req.user.iduser]);
    const idOrden = id[0].idOrdenFabricacion;
    await pool.query("SET time_zone = '-05:00'");
    await pool.query('insert into operador (idtipoOperador, idUsuario, idOrdenFabricacion, idTipoMarca) values ( ?, ?, ?, ?);', [1, req.user.iduser, idOrden, 1]);
    res.redirect('/detallesofoperador/'+idOrden)

});

router.get('/ordenesfabricacion', isLoggedIn, operador, async (req, res) => {
    const userId = req.user.iduser;
    const rolusuario = req.user.rolusuario;
    if (rolusuario===5){
        const datosof = await pool.query('select * from datosof where iduser=? and idStatus=1', [userId]);
        const ordenesAsignadasOPeradores = await pool.query('select * from dataAsignadas where iduser=? and idstatus=1 group by idOrdenFabricacion;', [userId])
        const preba= await pool.query('select * from dataOperadores where Fecha between DATE_FORMAT(NOW(), "%e/%m/%y") and DATE_FORMAT(curdate() -1, "%e/%m/%y");')
        console.log(preba);
        res.render('produccion/ordenesfabricacion', {
            datosof,
            ordenesAsignadasOPeradores
        })
    }else {
        const datosof = await pool.query('select * from datosof where idStatus=1');
        res.render('produccion/ordenesfabricacion', {datosof})
    }



});

router.get('/ordenesfabricacionTerminadas', isLoggedIn, operador, async (req, res) => {
    const userId = req.user.iduser;
    const rolusuario = req.user.rolusuario;
    if(rolusuario===5){
        const datosofCerradas = await pool.query('select * from dataOperadores where IDUsuario=? group by idOrden;', [userId]);
        res.render('produccion/operadores/ofterminadas', {datosofCerradas, rolusuario})
    }else {
        const datosofCerradas = await pool.query('select * from datosof where idStatus=2', [userId]);
        res.render('produccion/operadores/ofterminadas', {datosofCerradas, rolusuario})
    }
});

router.get('/ordenesfabricacionabiertas', isLoggedIn, operador, async (req, res) => {
    const rolusuario = req.user.rolusuario;
    const datosOfCreadas = await pool.query('select * from datosof where idstatus=1;');
    res.render('produccion/operadores/ofCreadas', {datosOfCreadas, rolusuario})
});


router.get('/detallesof/:id', isLoggedIn, digitador,  async (req, res) => {
    const ordenid = req.params.id;
    const rolusuario = req.user.rolusuario;
    const idUser= req.user.iduser;
    const datosHorasOperadores= await pool.query('select * from horasOperadoresCalcular where idOrden=?;', [ordenid]);
    const datosPara = await pool.query('select * from datosPara where idOrdenFabricacion=?', [ordenid]);
    const horasPara = await pool.query('select sec_to_time(sum(time_to_sec(horasPara))) as horasPara, idOrdenFabricacion from horasPara where idOrdenFabricacion=?', [ordenid])
    const ayudantesOrden = await pool.query("select * from horasOperadoresCalcular where idOrden=? and idTipoOperador=2 group by idUsuario;", [ordenid]);
    const datosAyudantes=[];
    for (const ayudante of ayudantesOrden){
        const idUsuario= ayudante.idUsuario;
        const idOrden= ayudante.idOrden;
        const HoraEntrada= ayudante.HoraEntrada;
        const HoraSalida= ayudante.HoraSalida;
        const nameMaquinaria= ayudante.nameMaquinaria;
        const nameMaterial= ayudante.nameMaterial;
        const nameTipoOperador= ayudante.nameTipoOperador;
        const fullname= ayudante.fullname;
        const nameTurno= ayudante.nameTurno;
        const resultadoSumaHoras= await pool.query('SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TiempoTrabajado))) AS Hora FROM horasOperadoresCalcular WHERE idUsuario=? AND idOrden=?', [idUsuario, idOrden]);
        const horasTotales=resultadoSumaHoras[0].Hora;
        datosAyudantes.push({
            idUsuario,
            idOrden,
            horasTotales,
            HoraEntrada,
            HoraSalida,
            nameMaquinaria,
            nameMaterial,
            nameTipoOperador,
            nameTurno,
            fullname
        });
   }
    const dataOperadorPrincipal = await pool.query('select * from dataOperadores where IdOrden=? and IdTipoOperador=1 group by IDUsuario;', [ordenid])
    const dataOperadorAyudante = await pool.query('select * from dataOperadores where IdOrden=? and IdTipoOperador=2 group by IDUsuario;', [ordenid])
    const HorasTrabajadasMaquina = dataOperadorPrincipal[0].HorasTrabajadas;
    let HorasParas = horasPara[0].horasPara;
    const hora1 = (HorasTrabajadasMaquina).split(":");
    if(HorasParas===null){
        var hora2 = ("00:00:00").split(":");
    }else {
        var hora2 = (HorasParas).split(":");
    }
    t1 = new Date(),
    t2 = new Date();
    t1.setHours(hora1[0], hora1[1], hora1[2]);
    t2.setHours(hora2[0], hora2[1], hora2[2]);
    t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
    var horasymin = t1.getHours()+":"+t1.getMinutes()+":"+t1.getSeconds();

    res.render('produccion/detallesof', {
        datosPara,
        horasPara: horasPara[0],
        //ayudantesOrden,
        dataOperadorPrincipal: dataOperadorPrincipal[0],
        dataOperadorAyudantes: dataOperadorAyudante[0],
        dataOperadorAyudante,
        horasymin,
        rolusuario,
        datosHorasOperadores,
        datosAyudantes

    })
    console.log(datosAyudantes);
});


router.get('/reportefechasoft', isLoggedIn, digitador, async (req, res)=>{
    res.render('produccion/reportesfechas')
})
router.post('/fechasreporte', isLoggedIn, async (req, res)=>{
    res.send("ok")
})

//A partir de aquí las rutas de los tecnicos


router.post('/operadormaquina/:id', isLoggedIn, async (req, res) => {
    const idOrdenFabricacion = req.params.id;
    const userId = req.user.iduser;
    //console.log(req.params);
    const {idtipoOperador, idTipoMarca} = req.body;
    const operador = {
        idOrdenFabricacion: idOrdenFabricacion,
        idUsuario: userId,
        idtipoOperador,
        idTipoMarca,
    }
    const prueba1 = await pool.query('select idHoraEntradaOf as idPrevio from horasEntradaOF where idOrden=? and idUsuario=? ORDER BY idHoraEntradaOf DESC LIMIT 1;', [idOrdenFabricacion, userId]);
    if(prueba1.length>0){
        var idPrevio= prueba1[0].idPrevio;
    }else {
        var idPrevio=0;
    }
    const prueba2 = await pool.query('select * from horasSalidaOF where idHoraEntrada=? ;', [idPrevio]);
    if (prueba1.length>=0 && prueba2.length>=0 ){
        await pool.query('insert into operador set ?;', [operador]);
        await pool.query('insert into horasEntradaOF set idUsuario=?, idTipoOperador=?, idOrden=?;', [userId, idtipoOperador, idOrdenFabricacion]);
        req.flash('success', 'Operador Asignado con exito');
    }else if(prueba1.length>=0 && prueba2.length<1) {
        console.log("Entró, pero no salió")
        req.flash('success', "Ya formas parte de la orden, puedes salir si es lo que necesitas");
    } else {
        console.log("Aquí no pasa nada")
    }
    res.redirect('/detallesofoperador/' + idOrdenFabricacion);

});

router.post('/salirof/:id', isLoggedIn, async (req, res) => {
    const idOrdenFabricacion = req.params;
    const userId = req.user.iduser;
    const {idtipoOperador, idTipoMarca} = req.body;
    const operador = {
        idOrdenFabricacion: idOrdenFabricacion.id,
        idUsuario: userId,
        idtipoOperador,
        idTipoMarca,
    }

    await pool.query('insert into operador set ?;', [operador]);
    const idPrevio = await pool.query('select idHoraEntradaOf from horasEntradaOF where idOrden=? and idUsuario=? order by create_at desc limit 1;', [idOrdenFabricacion.id, userId]);
    console.log(idPrevio[0].idHoraEntradaOf);
    await pool.query('insert into horasSalidaOF set idUsuario=?, idTipoOperador=?, idOrden=?,idHoraEntrada=? ;', [userId, idtipoOperador, idOrdenFabricacion.id, idPrevio[0].idHoraEntradaOf]);
    res.redirect('/detallesofoperador/' + operador.idOrdenFabricacion);
});


router.get('/detallesofoperador/:id',  isLoggedIn, permissions,async (req, res) => {
    const userId = req.user.iduser;
    const ordenid = req.params.id;
    const datosof = await pool.query('select * from datosof where idOrdenFabricacion=?', [ordenid]);
    const tipoPara = await pool.query('select * from tipoPara');
    const datosPara = await pool.query('select * from datosPara where idOrdenFabricacion=?', [ordenid]);
    const horasPara = await pool.query('select sec_to_time(sum(time_to_sec(horasPara))) as horasPara, idOrdenFabricacion from horasPara where idOrdenFabricacion=?', [ordenid])
    const horasOrden = await pool.query('select * from horasOrdenFabricacion where idOrdenFabricacion=?', [ordenid]);
    const horasOrdenT = await pool.query('select sec_to_time(sum(time_to_sec(horasOf))) as horasOrdenT, idOrdenFabricacion from horasOf where idOrdenFabricacion=?;', [ordenid]);
    const userOrden = await pool.query('select * from operador where idOrdenFabricacion=? and idUsuario=? order by create_at desc limit 1;', [ordenid, userId]);
    const ayudantesOrden = await pool.query('select idUsuario, idtipoOperador, idTipoMarca, u.fullname from operador inner join usuario u on operador.idUsuario=u.iduser where idtipoOperador=2 and idOrdenFabricacion=? and idTipoMarca=1 group by idUsuario;', [ordenid]);
    const HorasOperadoresOf= await pool.query("select * from horasOperadoresCalcular where idOrden=? and idUsuario=? ;", [ordenid,userId]);
    const tiempoOperador= await pool.query("select sec_to_time(sum(time_to_sec(TiempoTrabajado))) as Hora from horasOperadoresCalcular where idUsuario=? and idOrden=?;", [userId, ordenid])

    res.render('produccion/operadores/detallesofT', {
        datosof: datosof[0],
        tipoPara,
        datosPara,
        horasPara: horasPara[0],
        horasOrden: horasOrden[0],
        horasOrdenT: horasOrdenT[0],
        userOrden: userOrden[0],
        ayudantesOrden,
        HorasOperadoresOf,
        tiempoOperador: tiempoOperador[0].Hora

    })

});


router.post('/agregarPara', isLoggedIn, async (req, res) => {
    const {idTipoPara, horaInicio, horaFinal, comentario, idOrdenFabricacion} = req.body;
    const horas_Para = {
        idTipoPara,
        horaInicio,
        horaFinal,
        comentario,
        idOrdenFabricacion
    };
    await pool.query('insert into horasParas set ?', [horas_Para]);
    res.redirect('detallesofoperador/' + idOrdenFabricacion)
});


router.post('/cerrarof/:id', isLoggedIn, async (req, res) => {
    const ordenid = req.params.id;
    const userId = req.user.iduser;
    const { pesoKg, horaInicio, horaFinal, idtipoOperador, idTipoMarca} = req.body;
    await pool.query('insert into kgMaterial (kg, idOrdenFabricacion) values (?,?)', [pesoKg, ordenid]);
    await pool.query('insert into horasOrdenFabricacion(horaInicio, horaFinal, idOrdenFabricacion) values (?, ?, ?)', [horaInicio, horaFinal, ordenid]);
    await pool.query('insert into operador (idtipoOperador, idUsuario, idOrdenFabricacion, idTipoMarca) values ( ?, ?, ?, ?);', [idtipoOperador, userId, ordenid, idTipoMarca]);
    await pool.query('update ordenFabricacion set idstatus=2 where idOrdenFabricacion=?;', [ordenid]);
    const operadores = await pool.query('select idUsuario from operador where idOrdenFabricacion=? and idtipoOperador=2 group by idUsuario;', [ordenid]);

    for (let i = 0; i < operadores.length; i++) {
        const idOperador = operadores[i].idUsuario;
        //console.log(idOperador);
        const prueba1 = await pool.query('select idHoraEntradaOf as idPrevio from horasEntradaOF where idOrden=? and idUsuario=? ORDER BY idHoraEntradaOf DESC LIMIT 1;', [ordenid, idOperador]);
        //console.log(prueba1[0].idPrevio);
        console.log("La persona con el id: "+ idOperador+ "tiene "+ prueba1.length);
        if(prueba1.length>0){
            var idPrevio= prueba1[0].idPrevio;
        }else {
            var idPrevio=0;
        }
        const prueba2 = await pool.query('select * from horasSalidaOF where idHoraEntrada=? ;', [idPrevio]);
        console.log("La persona con el id: "+ idOperador+ "tiene "+ prueba2.length);
        if (prueba1.length===1 && prueba2.length ===0 ){
            console.log("El operador con el id "+idOperador+ " Solo entró y tiene como id previo" + idPrevio);
            console.log(idPrevio);
            await pool.query('insert into horasSalidaOF set idUsuario=?, idTipoOperador=?, idOrden=?,idHoraEntrada=? ;', [idOperador, 2, ordenid, idPrevio]);
        }else if(prueba1.length===1 && prueba2.length===1) {
            console.log("El operador con el id: "+idOperador+" entró y salió");
        } else {
            console.log("Aquí no pasa nada");
        }
    }

    await pool.query('insert into horasEntradaOF set idUsuario=?, idTipoOperador=?, idOrden=?;', [userId, 1, ordenid]);
    const idHoraEntrada = await pool.query('select idHoraEntradaOf as id from horasEntradaOF where idOrden=? and idUsuario=? and idtipoOperador=1 order by create_at desc limit 1;', [ordenid, userId]);
    await pool.query('insert into horasSalidaOF set idUsuario=?, idTipoOperador=?, idOrden=?,idHoraEntrada=? ;', [userId, 1, ordenid, idHoraEntrada[0].id]);
    res.redirect('/detallesofoperador/' + ordenid)
});


router.post('/buscarData', isLoggedIn, digitador, async(req, res)=>{
    await pool.query("SET time_zone = '-05:00'");
    //console.log(req.body);
    const {fecha1, fecha2}=req.body;
    console.log(fecha1, fecha2);
    const reportePrincipal= await pool.query('select * from dataOperadores where FechaCompleta between ? and ? group by IdOrden;', [fecha1, fecha2]);
    const reporteAyudantes= await pool.query('select Fecha, idOrden, idUsuario, fullname, nameTipoOperador, HoraEntrada, HoraSalida, TiempoTrabajado, nameTurno, nameMaquinaria, nameMaterial, HoraCompleta from horasOperadoresCalcular where HoraCompleta between ? and ? and idTipoOperador=2;', [fecha1, fecha2]);
    const reporteParas= await pool.query('select * from datosPara where FechaCompleta between ? and ?;',[fecha1, fecha2]);
    const idParas= await pool.query('select idOrdenFabricacion from datosPara where FechaCompleta between ? and ? group by idOrdenFabricacion;', [fecha1, fecha2]);
    const reporteParass = [];

    for (let i = 0; i < idParas.length; i++) {
        const idOrden = idParas[i].idOrdenFabricacion;
        const horasParas = await pool.query('SELECT sec_to_time(sum(time_to_sec(horasPara))) as horasPara, idOrdenFabricacion FROM horasPara WHERE idOrdenFabricacion=?;', [idOrden]);
        reporteParass.push(horasParas[0]);
    }

    res.render('produccion/reportesfechas', {reportePrincipal, reporteAyudantes,reporteParas, reporteParass})
} )


router.post('/buscar-detalle', isLoggedIn, async (req, res)=>{
    //console.log(req.body);
    const { idTipoPara  }=req.body;
    try{
        const result= await pool.query('select * from detallesPara where idTipoPara=?;', [idTipoPara]);
        if (result){
            res.json({result});
        }else{
            res.json({result: "No hay data"})
        }
    } catch (error){
        console.log("Error al consultar la bbdd")
        res.status(500).json({error: "Error al consultar la bbdd"})
    }

})



router.post('/buscarTipoPara', isLoggedIn, async (req, res)=>{
    const {IdMaquinaria}=req.body;
    try{
        const tipos = await pool.query('select * from paraDetallesMaquina where idMaquinaria=? group by idTipoPara;', [IdMaquinaria]);
        if (tipos){
            res.json({tipos})
        }else{
            res.json({tipos: "Lo siento no hay datos"})
        }
    }catch (error){
        console.log('Error al consultar la bbdd')
        res.status(500).json({error:"Error al consultar la bbdd"})
    }
})

router.get('/parastiposdetalle', isLoggedIn, digitador, async (req, res)=>{
    const tipoPara= await pool.query('select * from tipoPara');
    const detallePara= await pool.query('select * from detallePara');
    const maquinaria= await pool.query('select * from maquinaria');
    res.render('produccion/addparastipos', {tipoPara, detallePara, maquinaria})
})

router.post('/parastipo', isLoggedIn, digitador, async (req, res)=>{
    const {nameTipoPara} = req.body;
    const nameTipoParaFormat= nameTipoPara.toUpperCase()
    //console.log(nameTipoPara)
    try{
        await pool.query('insert into tipoPara set nameTipoPara = ?', [nameTipoParaFormat])
    }catch (error){
        console.log(error)

    }
    req.flash('success', "Tipo de para agregada correctamente");
    res.redirect('/parastiposdetalle')
})

router.post('/parasdetalle', isLoggedIn, digitador, async (req, res)=>{
    const {detalle} = req.body;
    const detalleFormat= detalle.toUpperCase();
    //console.log(detalle)
    try{
        await pool.query('insert into detallePara set detalle = ?', [detalleFormat])
    }catch (error){
        req.flash('error', "Error", +error);
        console.log(error)
    }
    req.flash('success', "Detalle agregado correctamente");
    res.redirect('/parastiposdetalle')
})
router.post('/tipoDetalle', isLoggedIn, digitador,  async (req, res)=>{
    const {idTipoPara, idDetalle} = req.body;
    //console.log(idTipoPara, idDetalle);
    try{
        await pool.query('insert into tipoParaDetalle set idTipoPara=?, idDetallePara=?', [idTipoPara, idDetalle])
    }catch (error){
        console.log(error)
    }
    req.flash('success', "Tipo y detalle ligado correctamente");
    res.redirect('/parastiposdetalle')
})


router.post('/paraMaquinaria', isLoggedIn, async (req, res)=>{
    const {idTipoPara, idMaquinaria}= req.body;
    //console.log(idTipoPara, idMaquinaria);
    try{
        await pool.query('insert into tipoParaMaquinaria set idMaquinaria=?, idTipoPara=?', [idMaquinaria, idTipoPara])
    }catch(error){
        console.log(error)
    }
    req.flash('success', "Maquinaria y tipo ligado correctamente");
    res.redirect('/parastiposdetalle')
})

module.exports = router;
