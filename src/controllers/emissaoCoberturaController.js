const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from EMISSAO_COBERTURA where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { emissaoCobertura_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO_COBERTURA set deletado = 1 where emissaoCobertura_id = ${emissaoCobertura_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { emissaoCobertura_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                EMISSAO_COBERTURA.emissaoCobertura_id,
                EMISSAO_COBERTURA.cliente_id,
                EMISSAO_COBERTURA.emissao_id,
                EMISSAO_COBERTURA.cobertura_id,
                CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_upd, 8) as ad_upd,
                EMISSAO_COBERTURA.ad_usr,
                EMISSAO_COBERTURA.deletado
            from EMISSAO_COBERTURA
            where (EMISSAO_COBERTURA.deletado = 0 or EMISSAO_COBERTURA.deletado is null) and emissaoCobertura_id = ${emissaoCobertura_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select 
                EMISSAO_COBERTURA.emissaoCobertura_id,
                EMISSAO_COBERTURA.cliente_id,
                EMISSAO_COBERTURA.emissao_id,
                EMISSAO_COBERTURA.cobertura_id,
                CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_COBERTURA.ad_upd, 8) as ad_upd,
                EMISSAO_COBERTURA.ad_usr,
                EMISSAO_COBERTURA.deletado
            from EMISSAO_COBERTURA
            where (EMISSAO_COBERTURA.deletado = 0 or EMISSAO_COBERTURA.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            emissao_id,
            cobertura_id,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into EMISSAO_COBERTURA (
                cliente_id,
                emissao_id,
                cobertura_id,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.emissaoCobertura_id VALUES (
                ${cliente_id},
                ${emissao_id},
                ${cobertura_id},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', emissaoCobertura_id: result[0].emissaoCobertura_id }]);
    },

    async update(request, response) {
        const { emissaoCobertura_id } = request.params;
        const {
            cliente_id,
            emissao_id,
            cobertura_id,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EMISSAO_COBERTURA set 
                EMISSAO_COBERTURA.cliente_id = ${cliente_id},
                EMISSAO_COBERTURA.emissao_id = ${emissao_id},
                EMISSAO_COBERTURA.cobertura_id = ${cobertura_id},
                EMISSAO_COBERTURA.ad_upd = '${ad_upd}',
                EMISSAO_COBERTURA.ad_usr = ${ad_usr}
            where emissaoCobertura_id = ${emissaoCobertura_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },
};