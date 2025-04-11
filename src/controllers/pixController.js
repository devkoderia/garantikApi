const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from PIX where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { pix_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update PIX set deletado = 1 where pix_id = ${pix_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { pix_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            PIX.pix_id,
            PIX.descricao
            from PIX
            where (PIX.deletado = 0 or PIX.deletado is null) and pix_id = ${pix_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            PIX.pix_id,
            PIX.descricao
            from PIX
            where (PIX.deletado = 0 or PIX.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        
        const { descricao, cliente_id } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into PIX (
            cliente_id,
            descricao,
            ad_new,
            ad_upd,
            deletado
        ) VALUES (
            ${cliente_id},
            '${descricao}',
            '${ad_new}',
            '${ad_upd}',
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async update(request, response) {

        const { pix_id } = request.params;
        const { descricao, cliente_id } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update PIX set 
            descricao = '${descricao}',
            ad_upd = '${ad_upd}'
            where pix_id = ${pix_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    }
};