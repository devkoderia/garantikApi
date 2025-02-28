const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from TOMADOR_CORRETOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { tomadorCorretor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update TOMADOR_CORRETOR set deletado = 1 where tomadorCorretor_id = ${tomadorCorretor_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { tomadorCorretor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            TOMADOR_CORRETOR.tomadorCorretor_id,
            TOMADOR_CORRETOR.cliente_id,
            TOMADOR_CORRETOR.tomador_id,
            TOMADOR_CORRETOR.corretor_id,
            CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_upd, 8) as ad_upd,
            TOMADOR_CORRETOR.ad_usr,
            TOMADOR_CORRETOR.deletado
            from TOMADOR_CORRETOR
            where (TOMADOR_CORRETOR.deletado = 0 or TOMADOR_CORRETOR.deletado is null) and tomadorCorretor_id = ${tomadorCorretor_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            TOMADOR_CORRETOR.tomadorCorretor_id,
            TOMADOR_CORRETOR.cliente_id,
            TOMADOR_CORRETOR.tomador_id,
            TOMADOR_CORRETOR.corretor_id,
            CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, TOMADOR_CORRETOR.ad_upd, 8) as ad_upd,
            TOMADOR_CORRETOR.ad_usr,
            TOMADOR_CORRETOR.deletado
            from TOMADOR_CORRETOR
            where (TOMADOR_CORRETOR.deletado = 0 or TOMADOR_CORRETOR.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        
        const {
            cliente_id,
            tomador_id,
            corretor_id,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into TOMADOR_CORRETOR (
            cliente_id,
            tomador_id,
            corretor_id,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${tomador_id},
            ${corretor_id},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { tomadorCorretor_id } = request.params;

        const {
            cliente_id,
            tomador_id,
            corretor_id,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update TOMADOR_CORRETOR set 
            tomador_id = ${tomador_id},
            corretor_id = ${corretor_id},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where tomadorCorretor_id = ${tomadorCorretor_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);

    }
};