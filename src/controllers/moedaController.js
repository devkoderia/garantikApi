const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async destroy(request, response) {

        var { moeda_id } = request.params

        const strsql = `update MOEDA set deletado = 1 where moeda_id = ${moeda_id}`;

        await executeQuery(strsql)

        response.status(200).json([{ status: 'ok' }])


    },


    async listaUm(request, response) {

        var { moeda_id } = request.params

        const strsql = `select 
				MOEDA.moeda_id
				,MOEDA.descricao
				,MOEDA.simbolo
				,MOEDA.iso
				,MOEDA.descricaoExtenso
                ,MOEDA.descricaoExtensoDecimal
				from MOEDA
				where (MOEDA.deletado = 0 or MOEDA.deletado is null) and moeda_id = ${moeda_id} and ativo = 1 order by descricao`;

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)

    },


    async listaTodos(request, response) {

        const strsql = `SELECT moeda_id, descricao FROM MOEDA where ativo = 1 order by descricao`;

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)
    },

};