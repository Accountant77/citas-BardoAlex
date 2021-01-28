const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const mailer={}

mailer.send = function send(reserve, template, subjectMessaje){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        //type:"OAuth2",
        auth:{
            user: 'jp3946079@gmail.com',
            pass: 'hxhmqzzdzbhqogxe'
        }
    })
    //console.log(template)
    mailer.getTemplate(template)
        .then(datosReserve=>
            transporter.sendMail({
                from: '"Bar do Alex" <barAlex@madrid.com',
                to: reserve.rEmail,
                subject: subjectMessaje,
                text: 'Gracias por reservar con nosotros',
                html: datosReserve.replace(/{{codigo}}|{{name}}|{{email}}|{{fecha}}|{{hora}}|{{code}}/g, (x)=>{
                    if (x=="{{email}}") return reserve.rEmail
                    else if (x=="{{name}}") return reserve.rName
                    else if (x=="{{fecha}}") return reserve.rDate
                    else if (x=="{{hora}}") return reserve.rHour
                    else if (x=="{{codigo}}") return reserve.rId
                    else if (x=="{{code}}") return reserve.rIdPrivate
                })
             })
        )
}

mailer.getTemplate = async function getTemplate(template){
    return fs.readFileSync(path.join(__dirname,`/mailer-templates/${template}.html`), 'utf-8')
}

module.exports = mailer
//hxhmqzzdzbhqogxe

/***
 * transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
 */