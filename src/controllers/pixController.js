const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from PIX where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { pix_id } = request.params;
        const strsql = `update PIX set deletado = 1 where pix_id = ${pix_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { pix_id } = request.params;
        const strsql = `select 
            PIX.pix_id,
            PIX.descricao
            from PIX
            where (PIX.deletado = 0 or PIX.deletado is null) and pix_id = ${pix_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
            PIX.pix_id,
            PIX.descricao
            from PIX
            where (PIX.deletado = 0 or PIX.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const { descricao } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into PIX (
            descricao,
            ad_new,
            ad_upd,
            deletado
        ) VALUES (
            '${descricao}',
            '${ad_new}',
            '${ad_upd}',
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {
        const { pix_id } = request.params;
        const { descricao } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update PIX set 
            descricao = '${descricao}',
            ad_upd = '${ad_upd}'
            where pix_id = ${pix_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};