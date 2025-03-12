const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select count(*) as total from CCG where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { ccg_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update CCG set deletado = 1 where ccg_id = ${ccg_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { ccg_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                CCG.ccg_id,
                CCG.cliente_id,
                CCG.tomador_id,
                CCG.tipo,
                CCG.arquivo,
                CONVERT(VARCHAR, CCG.ad_new, 103) + ' ' + CONVERT(VARCHAR, CCG.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CCG.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CCG.ad_upd, 8) as ad_upd,
                CCG.ad_usr,
                CCG.deletado
            from CCG
            where (CCG.deletado = 0 or CCG.deletado is null) and ccg_id = ${ccg_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
                CCG.ccg_id,
                CCG.cliente_id,
                CCG.tomador_id,
                CCG.tipo,
                CCG.arquivo,
                CONVERT(VARCHAR, CCG.ad_new, 103) + ' ' + CONVERT(VARCHAR, CCG.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CCG.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CCG.ad_upd, 8) as ad_upd,
                CCG.ad_usr,
                CCG.deletado
            from CCG
            where (CCG.deletado = 0 or CCG.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        
        const {
            cliente_id,
            tomador_id,
            tipo,
            arquivo,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into CCG (
                cliente_id,
                tomador_id,
                tipo,
                arquivo,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.ccg_id VALUES (
                ${cliente_id},
                ${tomador_id},
                '${tipo}',
                '${arquivo}',
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', ccg_id: result[0].ccg_id }]);
    },

    async update(request, response) {

        const { ccg_id } = request.params;
        const {
            cliente_id,
            tomador_id,
            tipo,
            arquivo,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update CCG set 
                CCG.cliente_id = ${cliente_id},
                CCG.tomador_id = ${tomador_id},
                CCG.tipo = '${tipo}',
                CCG.arquivo = '${arquivo}',
                CCG.ad_upd = '${ad_upd}',
                CCG.ad_usr = ${ad_usr}
            where ccg_id = ${ccg_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};