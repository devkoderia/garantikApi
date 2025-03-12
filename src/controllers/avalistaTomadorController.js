const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from AVALISTA_TOMADOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);

        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { avalistaTomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update AVALISTA_TOMADOR set deletado = 1 where avalistaTomador_id = ${avalistaTomador_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { avalistaTomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                AVALISTA_TOMADOR.avalistaTomador_id,
                AVALISTA_TOMADOR.cliente_id,
                AVALISTA_TOMADOR.tomador_id,
                AVALISTA_TOMADOR.avalista_id,
                CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_upd, 8) as ad_upd,
                AVALISTA_TOMADOR.ad_usr,
                AVALISTA_TOMADOR.deletado
            from AVALISTA_TOMADOR
            where (AVALISTA_TOMADOR.deletado = 0 or AVALISTA_TOMADOR.deletado is null) and avalistaTomador_id = ${avalistaTomador_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
                AVALISTA_TOMADOR.avalistaTomador_id,
                AVALISTA_TOMADOR.cliente_id,
                AVALISTA_TOMADOR.tomador_id,
                AVALISTA_TOMADOR.avalista_id,
                CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, AVALISTA_TOMADOR.ad_upd, 8) as ad_upd,
                AVALISTA_TOMADOR.ad_usr,
                AVALISTA_TOMADOR.deletado
            from AVALISTA_TOMADOR
            where (AVALISTA_TOMADOR.deletado = 0 or AVALISTA_TOMADOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);

        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            tomador_id,
            avalista_id,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into AVALISTA_TOMADOR (
                cliente_id,
                tomador_id,
                avalista_id,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.avalistaTomador_id VALUES (
                ${cliente_id},
                ${tomador_id},
                ${avalista_id},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
            
        const result = await executeQuery(strsql);

        response.status(200).json([{ status: 'ok', avalistaTomador_id: result[0].avalistaTomador_id }]);
    },

    async update(request, response) {

        const { avalistaTomador_id } = request.params;
        const {
            cliente_id,
            tomador_id,
            avalista_id,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update AVALISTA_TOMADOR set 
                AVALISTA_TOMADOR.cliente_id = ${cliente_id},
                AVALISTA_TOMADOR.tomador_id = ${tomador_id},
                AVALISTA_TOMADOR.avalista_id = ${avalista_id},
                AVALISTA_TOMADOR.ad_upd = '${ad_upd}',
                AVALISTA_TOMADOR.ad_usr = ${ad_usr}
            where avalistaTomador_id = ${avalistaTomador_id} and cliente_id = ${cliente_id}`;
            
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};

