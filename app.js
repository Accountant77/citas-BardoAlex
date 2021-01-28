/* 
<main>
    <div class="container">
        <div class="row">
            <div class="col-12 d-flex resultado justify-content-center">
                {{#each errores}}
                <div class="alert alert-danger" role="alert">
                    {This is a danger alert-check it out!}
                </div>
                {{/each}}
            </div>
        </div>
    </div>
</main>

EJERCICIO 2: En el ejercicio de citas, diseñar un sistema que permita al usuario seleccionar su cita y modificar el día. Usar rutas dinámicas.
											
EJERCICIO 3: En el ejercicio de citas, añadir el campo HORARIO para elegir la hora de la reserva. Cuando alguien seleccione un día en el calendario, deberán cargarse SÓLAMENTE LAS HORAS QUE ESTÁN LIBRES ESE DÍA en el campo HORARIO.


*/

const express = require('express')
const app = express()
const port = 8080
const path = require('path')

//routers
const rtMain = require('./routes/rtMain')
const rtCitas = require('./routes/rtCitas')

//configuracion del motor de plantillas handlebars
const exphbs = require('express-handlebars')
app.engine('.hbs', exphbs({
    extname: '.hbs', 
    defaultLayout:'main', 
    layoutsDir: path.join(__dirname,'views/layouts')
}))
app.set('view engine', '.hbs')

//middleware
app.use(express.static(__dirname+'/public'))//Hace publica o accequible los archivos que estan el la carpeta public// estatic hace que se pueda acceder a ciertos archivos o carppetas si no lo hago todo lo demas sera privado.
app.use(express.urlencoded({extended:true}))//Permite que en el body lleguen los datos y no llegue undefined. Parsea los datos enviados por un formulario
app.use(express.json())//Puede recibir informacion en objeto json
app.use('/', rtMain)
app.use('/citas', rtCitas)

//run server
app.listen(port, (err)=>{console.log(`Server run on port: ${port}`)})