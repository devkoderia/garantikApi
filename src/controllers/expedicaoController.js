const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {
        const strsql = `select count(*) as total from EXPEDICAO where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { expedicao_id } = request.params;
        const strsql = `update EXPEDICAO set deletado = 1 where expedicao_id = ${expedicao_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {
        const { expedicao_id } = request.params;
        const strsql = `select 
            EXPEDICAO.expedicao_id,
            EXPEDICAO.descricao
            from EXPEDICAO
            where (EXPEDICAO.deletado = 0 or EXPEDICAO.deletado is null) and expedicao_id = ${expedicao_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {
        const strsql = `select 
            EXPEDICAO.expedicao_id,
            EXPEDICAO.descricao
            from EXPEDICAO
            where (EXPEDICAO.deletado = 0 or EXPEDICAO.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const { descricao } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into EXPEDICAO (
            descricao
        ) VALUES (
            '${descricao}'
        )`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async update(request, response) {
        const { expedicao_id } = request.params;
        const { descricao } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EXPEDICAO set 
            descricao = '${descricao}'
            where expedicao_id = ${expedicao_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    }
};