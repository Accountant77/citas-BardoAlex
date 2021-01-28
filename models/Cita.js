
module.exports= class Cita{
    //constructor
    constructor(reserve){
        this.rName=reserve.rName
        this.rLastname=reserve.rLastname
        this.rPhone=reserve.rPhone
        this.rEmail=reserve.rEmail
        this.rDate=reserve.rDate
        this.rHour=reserve.rHour
    }

    //getters y setter
    
    //métodos privados (cosas que queremos hacer con esta clase)
    validation(){
        let errors=[]
        if(this.rName=="") errors.push({error:"El campo nombre no puede estar vacio."})
        if(this.rLastname=="") errors.push({error:"El campo apellidos no puede estar vacio."})
        if(this.rPhone=="") errors.push({error:"El campo telefono no puede estar vacio."})
        if(this.rPhone[0]!="6") errors.push({error:"El telefono debe iniciar por 6"})        
        if(this.rEmail=="") errors.push({error:"El campo email no puede estar vacio."})
        if(this.rName=="") errors.push({error:"El campo nombre no puede estar vacio."})
        //@mail
        //^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$
        let regEmail=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
        if (!regEmail.test(this.rEmail)) errors.push({error:"El formato del email no es valido"})
        return errors 
    }
}