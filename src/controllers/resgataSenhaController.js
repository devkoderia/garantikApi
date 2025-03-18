const { enviaMail } = require('../controllers/emailController')

module.exports = {


    async create(request, response) {

        const { email } = request.body


        var titulo = 'Resgate de senha'

        var texto = `
        
        Olá fulano...
        
        
        `


        await enviaMail({


            emailDestino: email,
            texto: texto,
            titulo: titulo,



        })



    }


}