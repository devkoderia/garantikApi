const axios = require('axios');

module.exports = {


    async consultaCNPJ(request, response) {

        var { cnpj } = request.params

        await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`).then((result) => {

            response.status(200).send(result.data)

        }).catch((err) => {

            response.status(200).send({status: 'não encontrado'})

        })


    },


}