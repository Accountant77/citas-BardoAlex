const fs = require('fs')
const generate = require('@codedipper/random-code')
const path = require('path')
const Cita = require('../models/Cita')

let daoCitas = {}

//Acceso a base de datos (Lectura del archivo citas.json) Listado de citas
daoCitas.getCitas = function getCitas(){
    return new Promise((resolved,reject)=>{
        fs.readFile(path.join(__dirname,'..','citas.json'), 'utf8', (err,data)=>{
            if (err) reject(err)
            resolved(JSON.parse(data))
        })
    })
}

//Almacenamiento de datos (Escritura del archivo citas.json)
daoCitas.saveCitas = function saveCitas(reserve){
    return new Promise((resolved,reject)=>{
        fs.writeFile('./citas.json', JSON.stringify(reserve), (err)=>{
            if(err) reject(err)
            resolved (reserve)
        })
    })
}

//Consulta de citas por fecha
daoCitas.getHoursAvailable = function getHoursAvailable(dateSearch){
    let workday=["10:00","11:00","12:00","13:00","14:00"]
    let removed=[]
    return new Promise((resolved,reject)=>{
        this.getCitas()
            .then(citas=>{
                let day=citas.filter(e=>e.rDate==dateSearch)
                if (day.length > 0){
                    day.forEach((cita)=>{
                        workday.forEach((hour,j)=>{                            
                            if (hour == cita.rHour) removed=workday.splice(j, 1)
                        })
                    })
                   resolved(workday)
                }
                else if (day.length == 0){
                        resolved(workday)
                }
                else reject('Error con la promesa linea 36 daoCitas')
            })
            .catch(err=>console.log("Error: catch linea 38, daoCitas: ", err))
    })
}

//Creacion de nuevas reservas
daoCitas.addCita = function addCita(reserve){
    return new Promise((resolved,reject)=>{
    this.getCitas()
        .then(reserves=>{
            if (reserves != undefined){
                let compare=reserves.find(e=> e.rDate == reserve.rDate && e.rHour == reserve.rHour)
                if (compare != undefined){
                    reserve.rId=undefined
                    resolved(reserve)
                }else{
                    reserve.rId=generate(6)
                    reserve.rIdPrivate=generate(30)
                    reserves.push(reserve)
                    this.saveCitas(reserves)
                        .then(resolved(reserve))
                        .catch(err=>console.log(err))                    
                }
            }else
                reject('Promebla con el Array citas Linea 61 daoCitas')
        })
        .catch(err=> console.log("El error esta en la Linea64 de daoCitas y es: ", err))
    })
}

//Verificación de usuario y modificar citas
daoCitas.reserveEditValidation = function reserveEditValidation(dataEdit){
    return new Promise((resolved,reject)=>{
        this.getCitas()
            .then(reserves=>{
                let reserveEdit=reserves.filter(e=>e.rId==dataEdit.rId && e.rEmail==dataEdit.rEmail)
                if (reserveEdit!=undefined) resolved(reserveEdit)
                else {
                    reject(reserveEdit)
                }

                //verificacion a travez de email
                    /*day.forEach((cita)=>{
                        workday.forEach((hour,j)=>{                            
                            if (hour == cita.rHour) removed=workday.splice(j, 1)
                        })
                    })
                   resolved(workday)*/
            })
            .catch(err=>console.log(err))
    })
}

//Busqueda por Id
daoCitas.getCitaById = function getCitaById(id){
    return new Promise((resolved,reject)=>{
        this.getCitas()
            .then(reserves=>{
                if (reserves != undefined){
                    let compare=reserves.find(e=> e.rIdPrivate == id)
                    if (compare != undefined)
                        resolved(compare)
                }else reject('Problema con el Array citas Linea 61 daoCitas')
            })
            .catch(err=> console.log("El error esta en la Linea113 de daoCitas y es: ", err))
        })
}

//Actualizacion de cita
daoCitas.updateCita = function updateCita(reserveUpdate){
    return new Promise((resolved,reject)=>{
        this.getCitas()
            .then(reserves=>{
                let indexReserveUp=reserves.findIndex(e=> e.rIdPrivate == reserveUpdate.rIdPrivate)
                let reserveUp=reserves.find(e=> e.rIdPrivate == reserveUpdate.rIdPrivate)
                if (indexReserveUp != -1){
                    reserveUp.rDate=reserveUpdate.rDate
                    reserveUp.rHour=reserveUpdate.rHour
                    reserves.splice(indexReserveUp,1,reserveUp)
                    this.saveCitas(reserves)
                        .then(resolved(reserveUp))
                        .catch(err=>console.log(err))                    
                }
                else reject('No se encontro esa reserva')
            })
            .catch(err=> console.log("El error esta en la Linea131 de daoCitas y es: ", err))
    })
}

//Eliminacion de cita
daoCitas.deleteCita = function deleteCita(reserveUpdate){
    return new Promise((resolved,reject)=>{
        this.getCitas()
            .then(reserves=>{
                let indexReserveDel=reserves.findIndex(e=> e.rIdPrivate == reserveUpdate.rIdPrivate)
                reserves.splice(indexReserveDel,1)
                    this.saveCitas(reserves)
                        .then(resolved('Deleted OK'))
                        .catch(reject('No se encontro esa reserva'))                     
            })
            .catch(err=> console.log("El error esta en la Linea147 de daoCitas y es: ", err))
    })
}


module.exports = daoCitas