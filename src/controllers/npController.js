const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from NP where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { np_id } = request.params;
        const strsql = `update NP set deletado = 1 where np_id = ${np_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { np_id } = request.params;
        const strsql = `select 
            NP.np_id,
            NP.cliente_id,
            NP.emissao_id,
            NP.valor,
            NP.valorExtenso,
            CONVERT(VARCHAR, NP.ad_new, 103) + ' ' + CONVERT(VARCHAR, NP.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, NP.ad_upd, 103) + ' ' + CONVERT(VARCHAR, NP.ad_upd, 8) as ad_upd,
            NP.ad_usr,
            NP.deletado
            from NP
            where (NP.deletado = 0 or NP.deletado is null) and np_id = ${np_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
            NP.np_id,
            NP.cliente_id,
            NP.emissao_id,
            NP.valor,
            NP.valorExtenso,
            CONVERT(VARCHAR, NP.ad_new, 103) + ' ' + CONVERT(VARCHAR, NP.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, NP.ad_upd, 103) + ' ' + CONVERT(VARCHAR, NP.ad_upd, 8) as ad_upd,
            NP.ad_usr,
            NP.deletado
            from NP
            where (NP.deletado = 0 or NP.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            emissao_id,
            valor,
            valorExtenso,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into NP (
            cliente_id,
            emissao_id,
            valor,
            valorExtenso,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${emissao_id},
            ${valor},
            '${valorExtenso}',
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {
        const { np_id } = request.params;
        const {
            cliente_id,
            emissao_id,
            valor,
            valorExtenso,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update NP set 
            cliente_id = ${cliente_id},
            emissao_id = ${emissao_id},
            valor = ${valor},
            valorExtenso = '${valorExtenso}',
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where np_id = ${np_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};