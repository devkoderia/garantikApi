const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from IBGE where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { ibge_codigo } = request.params;
        const strsql = `update IBGE set deletado = 1 where ibge_codigo = ${ibge_codigo}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { ibge_codigo } = request.params;
        const strsql = `select 
            IBGE.ibge_codigo,
            IBGE.ibge_descri,
            IBGE.uf_codigo,
            IBGE.uf_descri
            from IBGE
            where (IBGE.deletado = 0 or IBGE.deletado is null) and ibge_codigo = ${ibge_codigo}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
            IBGE.ibge_codigo,
            IBGE.ibge_descri,
            IBGE.uf_codigo,
            IBGE.uf_descri
            from IBGE
            where (IBGE.deletado = 0 or IBGE.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            ibge_descri,
            uf_codigo,
            uf_descri
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into IBGE (
            ibge_descri,
            uf_codigo,
            uf_descri
        ) VALUES (
            '${ibge_descri}',
            '${uf_codigo}',
            '${uf_descri}'
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {
        const { ibge_codigo } = request.params;
        const {
            ibge_descri,
            uf_codigo,
            uf_descri
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update IBGE set 
            ibge_descri = '${ibge_descri}',
            uf_codigo = '${uf_codigo}',
            uf_descri = '${uf_descri}',
            ad_upd = '${ad_upd}'
            where ibge_codigo = ${ibge_codigo}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};