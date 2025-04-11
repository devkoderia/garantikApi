const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from COBERTURA where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { cobertura_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update COBERTURA set deletado = 1 where cobertura_id = ${cobertura_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { cobertura_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                COBERTURA.cobertura_id,
                COBERTURA.cliente_id,
                COBERTURA.tipo,
                COBERTURA.descricao,
                CONVERT(VARCHAR, COBERTURA.ad_new, 103) + ' ' + CONVERT(VARCHAR, COBERTURA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, COBERTURA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, COBERTURA.ad_upd, 8) as ad_upd,
                COBERTURA.ad_usr,
                COBERTURA.deletado
            from COBERTURA
            where (COBERTURA.deletado = 0 or COBERTURA.deletado is null) and cobertura_id = ${cobertura_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
                COBERTURA.cobertura_id,
                COBERTURA.cliente_id,
                COBERTURA.tipo,
                COBERTURA.descricao,
                CONVERT(VARCHAR, COBERTURA.ad_new, 103) + ' ' + CONVERT(VARCHAR, COBERTURA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, COBERTURA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, COBERTURA.ad_upd, 8) as ad_upd,
                COBERTURA.ad_usr,
                COBERTURA.deletado
            from COBERTURA
            where (COBERTURA.deletado = 0 or COBERTURA.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        
        const {
            cliente_id,
            tipo,
            descricao,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into COBERTURA (
                cliente_id,
                tipo,
                descricao,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.cobertura_id VALUES (
                ${cliente_id},
                '${tipo}',
                '${descricao}',
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', cobertura_id: result[0].cobertura_id }]);
    },

    async update(request, response) {
        
        const { cobertura_id } = request.params;
        const {
            cliente_id,
            tipo,
            descricao,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update COBERTURA set 
                COBERTURA.cliente_id = ${cliente_id},
                COBERTURA.tipo = '${tipo}',
                COBERTURA.descricao = '${descricao}',
                COBERTURA.ad_upd = '${ad_upd}',
                COBERTURA.ad_usr = ${ad_usr}
            where cobertura_id = ${cobertura_id} and cliente_id = ${cliente_id}`;
            
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
        
    },
};