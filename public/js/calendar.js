    //Configuration flatpickr 
    const myInput = document.querySelector("input[name='rDate']");
    const fp = flatpickr(myInput, {
      inline:true,
      enableTime: false,
      altInput: true,
      altFormat: 'd M Y',
      dateFormat: 'Y-m-d',
      minDate: "today",
      maxDate: new Date().fp_incr(30),
      //defaultDate: ["2021-01-20", "2021-01-30", "2021-02-01"],
      //disable: ["2025-01-30", "2025-02-21", "2025-03-08", new Date(2025, 4, 9) ],
      locale: {
        firstDayOfWeek: 0,
        weekdays: {
            shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],         
        }, 
        months: {
            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Оct', 'Nov', 'Dic'],
            longhand: ['Enero', 'Febrero', 'Мarzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        }
      }
    })
  
    //En base a la fecha seleccionada hago una peticion al servidor enviandole la fecha para que luego me muestre las horas de ese dia.
    fp.config.onChange.push(()=>{
        let dayConsult = fp.selectedDates[0]
        let dayNumber = Date.parse(dayConsult)
        console.log(dayNumber)
        fetch('/citas/consultarHours',{
            method: 'POST',
            body: JSON.stringify({dayConsult:dayNumber}),
            headers: {'Content-type':'application/json'}
        })
            .then(res=>res.json())
            .then(hours=>{
                document.querySelector('.showHours').innerHTML=''
                let hoursWorkday = []
                for (let i=0; i<hours.hours.length; i++){
                  hoursWorkday.push(hours.hours[i])
                }
                let workday = document.createElement('div')
                hoursWorkday.forEach(e=>{
                    let clon = workday.cloneNode(true)
                    clon.className=`hours-free`
                    clon.id=`${e}`
                    clon.textContent=e                   
                    document.querySelector('.showHours').appendChild(clon)                    
                })
            })
    })

    //Recogemos la Hora seleccionada para enviarla junto al formulario
    document.querySelector('.showHours').onclick=(e)=>{
      document.getElementById(`${e.target.id}`).className=`hour-free select`
      let hour=e.target.id
      document.querySelector('input[name="rHour"]').value = hour
      //console.log(document.querySelector('input[name="rHour"]').value)
    }

    //Muestra la segunda parte del formulario y oculta la primera
    document.querySelector('#confirm').onclick=()=>{
      if (document.querySelector('input[name="rHour"]').value){
          let mostrarVista=document.querySelector('#part2')
          mostrarVista.classList.remove("part2")
          let ocultarVista=document.querySelector('#part1')
          ocultarVista.classList.add("part2")
          document.querySelector('.info').innerHTML="<p><span>Paso 2.</span> Completa tus datos.</p>"
      }else{
        alert("no ha seleccionado ninguna fecha")
      }
    }


