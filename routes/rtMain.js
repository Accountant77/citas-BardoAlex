const express = require('express')
const rtMain = express.Router()

/*************Home Bar******************/
rtMain.get('/', function (req, res) {
    //Mostramos el limite de aforo
    //res.send("<h1>Bienvenidos al Bar do ALex</h1> <a href=/citas/cita>Haz click aqui para ir a la gestion de Citas</a>")
    res.render('home')
})


module.exports = rtMain