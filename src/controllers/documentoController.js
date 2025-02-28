const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from DOCUMENTO where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { documento_id } = request.params;
        const strsql = `update DOCUMENTO set deletado = 1 where documento_id = ${documento_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { documento_id } = request.params;
        const strsql = `select 
                DOCUMENTO.documento_id,
                DOCUMENTO.cliente_id,
                DOCUMENTO.favorecido_id,
                DOCUMENTO.tomador_id,
                DOCUMENTO.arquivo,
                DOCUMENTO.uuid,
                CONVERT(VARCHAR, DOCUMENTO.ad_new, 103) + ' ' + CONVERT(VARCHAR, DOCUMENTO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, DOCUMENTO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, DOCUMENTO.ad_upd, 8) as ad_upd,
                DOCUMENTO.ad_usr,
                DOCUMENTO.deletado
            from DOCUMENTO
            where (DOCUMENTO.deletado = 0 or DOCUMENTO.deletado is null) and documento_id = ${documento_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
                DOCUMENTO.documento_id,
                DOCUMENTO.cliente_id,
                DOCUMENTO.favorecido_id,
                DOCUMENTO.tomador_id,
                DOCUMENTO.arquivo,
                DOCUMENTO.uuid,
                CONVERT(VARCHAR, DOCUMENTO.ad_new, 103) + ' ' + CONVERT(VARCHAR, DOCUMENTO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, DOCUMENTO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, DOCUMENTO.ad_upd, 8) as ad_upd,
                DOCUMENTO.ad_usr,
                DOCUMENTO.deletado
            from DOCUMENTO
            where (DOCUMENTO.deletado = 0 or DOCUMENTO.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            favorecido_id,
            tomador_id,
            arquivo,
            uuid,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into DOCUMENTO (
                cliente_id,
                favorecido_id,
                tomador_id,
                arquivo,
                uuid,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.documento_id VALUES (
                ${cliente_id},
                ${favorecido_id},
                ${tomador_id},
                '${arquivo}',
                '${uuid}',
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
            favorecido_id,
            tomador_id,
            arquivo,
            uuid,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update DOCUMENTO set 
                DOCUMENTO.cliente_id = ${cliente_id},
                DOCUMENTO.favorecido_id = ${favorecido_id},
                DOCUMENTO.tomador_id = ${tomador_id},
                DOCUMENTO.arquivo = '${arquivo}',
                DOCUMENTO.uuid = '${uuid}',
                DOCUMENTO.ad_upd = '${ad_upd}',
                DOCUMENTO.ad_usr = ${ad_usr}
            where documento_id = ${documento_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};