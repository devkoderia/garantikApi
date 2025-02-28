const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from PERFIL where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { perfil_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update PERFIL set deletado = 1 where perfil_id = ${perfil_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { perfil_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            PERFIL.perfil_id,
            PERFIL.cliente_id,
            PERFIL.descricao,
            CONVERT(VARCHAR, PERFIL.ad_new, 103) + ' ' + CONVERT(VARCHAR, PERFIL.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, PERFIL.ad_upd, 103) + ' ' + CONVERT(VARCHAR, PERFIL.ad_upd, 8) as ad_upd,
            PERFIL.ad_usr
            from PERFIL
            where (PERFIL.deletado = 0 or PERFIL.deletado is null) and perfil_id = ${perfil_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select 
            PERFIL.perfil_id,
            PERFIL.descricao
            from PERFIL
            where (PERFIL.deletado = 0 or PERFIL.deletado is null) and cliente_id = ${cliente_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            descricao,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into PERFIL (
            cliente_id,
            descricao,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            '${descricao}',
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { perfil_id } = request.params;
        const {
            cliente_id,
            descricao,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update PERFIL set 
            descricao = '${descricao}',
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where perfil_id = ${perfil_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};