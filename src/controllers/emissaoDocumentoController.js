const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from EMISSAO_DOCUMENTO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { documento_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO_DOCUMENTO set deletado = 1 where documento_id = ${documento_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { documento_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                EMISSAO_DOCUMENTO.documento_id,
                EMISSAO_DOCUMENTO.cliente_id,
                EMISSAO_DOCUMENTO.emissao_id,
                EMISSAO_DOCUMENTO.arquivo,
                CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_upd, 8) as ad_upd,
                EMISSAO_DOCUMENTO.ad_usr,
                EMISSAO_DOCUMENTO.deletado
            from EMISSAO_DOCUMENTO
            where (EMISSAO_DOCUMENTO.deletado = 0 or EMISSAO_DOCUMENTO.deletado is null) and documento_id = ${documento_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select 
                EMISSAO_DOCUMENTO.documento_id,
                EMISSAO_DOCUMENTO.cliente_id,
                EMISSAO_DOCUMENTO.emissao_id,
                EMISSAO_DOCUMENTO.arquivo,
                CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_DOCUMENTO.ad_upd, 8) as ad_upd,
                EMISSAO_DOCUMENTO.ad_usr,
                EMISSAO_DOCUMENTO.deletado
            from EMISSAO_DOCUMENTO
            where (EMISSAO_DOCUMENTO.deletado = 0 or EMISSAO_DOCUMENTO.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            emissao_id,
            arquivo,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into EMISSAO_DOCUMENTO (
                cliente_id,
                emissao_id,
                arquivo,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.documento_id VALUES (
                ${cliente_id},
                ${emissao_id},
                '${arquivo}',
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', documento_id: result[0].documento_id }]);
    },

    async update(request, response) {
        
        const { documento_id } = request.params;
        const {
            cliente_id,
            emissao_id,
            arquivo,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EMISSAO_DOCUMENTO set 
                EMISSAO_DOCUMENTO.cliente_id = ${cliente_id},
                EMISSAO_DOCUMENTO.emissao_id = ${emissao_id},
                EMISSAO_DOCUMENTO.arquivo = '${arquivo}',
                EMISSAO_DOCUMENTO.ad_upd = '${ad_upd}',
                EMISSAO_DOCUMENTO.ad_usr = ${ad_usr}
            where documento_id = ${documento_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};