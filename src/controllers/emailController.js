
module.exports = {


    async enviaMail(obj) {

        const emailSender = 'naoresponda@alicancasolidaria.com.br'
        const senhaSender = '123456'
        
        var mailOptions = {
            from: emailSender,
            to: obj.emailDestino,
            subject: obj.titulo,
            html: obj.texto,
        };
    
        var nodemailer = require('nodemailer');
        console.log('aqui: ' + obj.emailDestino);
    
        // Updated regex pattern for email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;
    
        // Validate the emailDestino field
        if (obj.emailDestino && emailRegex.test(obj.emailDestino)) {
            var transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secureConnection: false,
                secure: false,
                requireTLS: true,
                auth: {
                    user: emailSender,
                    pass: senhaEmailSender
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            });
    
            return await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        //reject(error);
                        resolve({ alerta: 'ok', descricao: error})
                    } else {
                        resolve({ alerta: 'ok', descricao: info.response });
                    }
                });
            });
        } else {
            console.log("Email inválido");
        }
    },
    

}