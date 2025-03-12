const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');


module.exports = {
    

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from ACESSO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)

    },


    async destroy(request, response) {

        var { acesso_id } = request.params
        const { cliente_id } = request.body;

        const strsql = `update ACESSO set deletado = 1 where acesso_id = ${acesso_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql)

        response.status(200).json([{ status: 'ok' }])


    },


    async listaUm(request, response) {

        var { acesso_id } = request.params
        const { cliente_id } = request.body;

        const strsql = `select 
				ACESSO.acesso_id
				,ACESSO.cliente_id
				,ACESSO.usuario_id
				,ACESSO.tipo
				,ACESSO.ip
				,ACESSO.usuario
				,ACESSO.senha
				,CONVERT(VARCHAR, ACESSO.ad_new, 103) + ' ' + CONVERT(VARCHAR, ACESSO.ad_new, 8) as ad_new
				from ACESSO
				where (ACESSO.deletado = 0 or ACESSO.deletado is null) and acesso_id = ${acesso_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)

    },


    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
				ACESSO.acesso_id
				,ACESSO.cliente_id
				,ACESSO.usuario_id
				,ACESSO.tipo
				,ACESSO.ip
				,ACESSO.usuario
				,ACESSO.senha
				,CONVERT(VARCHAR, ACESSO.ad_new, 103) + ' ' + CONVERT(VARCHAR, ACESSO.ad_new, 8) as ad_new
				from ACESSO
				where (ACESSO.deletado = 0 or ACESSO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)
    },


    async create(request, response) {

        var {

            cliente_id,
            usuario_id,
            tipo,
            ip,
            usuario,
            senha,

        } = request.body

        if (!ip) { ip = '' }

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss')

        const strsql = `insert into ACESSO (
				cliente_id
				,usuario_id
				,tipo
				,ip
				,usuario
				,senha
				,ad_new
				) OUTPUT INSERTED.acesso_id VALUES (
				${cliente_id}
				,${usuario_id}
				,'${tipo}'
				,'${ip}'
				,'${usuario}'
				,'${senha}'
				,'${ad_new}'
				)`

        await executeQuery(strsql)

        response.status(200).json([{ status: 'ok', acesso_id: result[0].acesso_id }]);

    },

};