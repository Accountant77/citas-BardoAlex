//Creacion del router rtCitas
const express = require('express')
const rtCitas = express.Router()
//Capa de modelo
const daoCitas = require('../dao/daoCitas')
const Cita = require('../models/Cita')
//Otros Modulos
const fs = require('fs')
const path = require('path')
//Utilidades
const mailer = require('../modules/mailer')



/*************Home Citas*****************/
rtCitas.get('/cita', (req,res)=>{
    res.render('homeCita', {title: 'Gestion de citas'})    
})

/***************Show Hours**************/
rtCitas.post('/consultarHours', (req,res)=>{
    let dayConsult=req.body.dayConsult + 3600000
    let dateSearch=converteDate(new Date(dayConsult))
    daoCitas.getHoursAvailable(dateSearch)
        .then(hoursAvailable=>{
            res.json({hours:hoursAvailable})
        })
        .catch(err=>console.log(`Error al intentar devolver horarios libres: linea 50, rtCitas: ${err}`))

    function converteDate(dayConsult){
        month = '' + (dayConsult.getMonth() + 1)
        day = '' + dayConsult.getDate()
        year = dayConsult.getFullYear()
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        let dayConsultConverte = `${year}-${month}-${day}`
        return dayConsultConverte  
    }
})


/*************Add Cita*******************/
rtCitas.get('/new-cita', (req,res)=>{
    res.render('newCita', {title: 'Nueva Cita'})
})

/************Add Cita / Save Cita*********/
rtCitas.post('/save', (req,res)=>{
    //Datos enviados al objeto Cita
    let reserve = new Cita(req.body)
    //Validación
    let errors = reserve.validation()
    //Procedimiento para guardar la nueva reserva
    if (errors.length==0){
        daoCitas.addCita(reserve)
        .then(reserve=>{
            if (reserve.rId != undefined){
                mailer.send(reserve, 'newReserve', 'Gracias por reservar con nosotros!!')
                let dataCita = `${reserve.rName} ${reserve.rLastname} tu reserva para el d dia ${reserve.rDate} a las ${reserve.rHour} ha sido asignada correctamente, guarda este codigo QR que te ayudará a tener un acceso facil a nuestras instalaciones, Gracias.`
                res.render('resultado', {cita:reserve, codigoQr:dataCita})
            }else
                res.render('intentar', {miParametro:reserve.rName, fecha:reserve.rDate})
        })
        .catch(err=>console.log(`Error al intentar guardar la cita generada: linea 39, rtCitas: ${err}`))
    }else{
        res.render('newCita', {errors: errors})
    }
})


/**************Edit Cita***************/
rtCitas.get('/edit-cita', (req,res)=>{
    res.render('editCita', {title:'Editar Cita'})
})

/*********Edit Cita - Verificacion @mail***************/
rtCitas.post('/confirm-edit-cita', (req,res)=>{
    let dataEdit = req.body
    daoCitas.reserveEditValidation(dataEdit)
        .then(reserveEdit=>{
            if(reserveEdit==0){
                let response="Alguno de los datos ingresados es incorrecto, intentelo nuevamente"
                res.render('editCita', {message:response})
            }else{
                //mailer.send(reserve, 'newReserve', 'Gracias por reservar con nosotros!!')
                mailer.send(reserveEdit, 'editReserve', 'Procedimiento para editar/eliminar su cita!!')
                let response="Se ha enviado un mensaje a tu email,  debes revisarlo"
                res.render('editCita', {message:response})
            }
        })            
        .catch(err=>console.log(`El error esta por aqui!! linea 90 rtCitas ${err}`))
})

/*********Edit Cita - Buscar cita**********************/
rtCitas.get('/confirm-edit-cita/:id', (req,res)=>{
    let idUser = req.params.id
    daoCitas.getCitaById(idUser)
        .then(reserve=>{
            res.render('editCita2', {title: 'Editando Cita', cita:reserve})
        })
})

/**********Edit Cita - Edicion y actualizacion*********/
rtCitas.post('/update-delete', (req,res)=>{
    let reserveUpdate= req.body
    //Update reserve
    if(reserveUpdate.process == "update"){
        daoCitas.updateCita(reserveUpdate)
            .then(reserveUp=>{
                mailer.send(reserveUp, 'newReserve', 'Cita actualizada, Gracias por reservar con nosotros!!')
                let dataCita = `${reserveUp.rName} ${reserveUp.rLastname} tu reserva para el d dia ${reserveUp.rDate} a las ${reserveUp.rHour} ha sido asignada correctamente, guarda este codigo QR que te ayudará a tener un acceso facil a nuestras instalaciones, Gracias.`
                res.render('resultado', {cita:reserveUp, codigoQr:dataCita})
            })
    }
    //Delete Reserve
    if(reserveUpdate.process == "delete"){
        daoCitas.deleteCita(reserveUpdate)
        .then(res.render('citaDelete',{cita: reserveUpdate}))
    }
       
})

module.exports = rtCitas