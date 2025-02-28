const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from BANCO where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { banco_id } = request.params;
        const strsql = `update BANCO set deletado = 1 where banco_id = ${banco_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { banco_id } = request.params;
        const strsql = `select 
                BANCO.banco_id,
                BANCO.numero,
                BANCO.descricao,
                BANCO.ispb,
                BANCO.deletado
            from BANCO
            where (BANCO.deletado = 0 or BANCO.deletado is null) and banco_id = ${banco_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
                BANCO.banco_id,
                BANCO.numero,
                BANCO.descricao,
                BANCO.ispb,
                BANCO.deletado
            from BANCO
            where (BANCO.deletado = 0 or BANCO.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            numero,
            descricao,
            ispb,
        } = request.body;

        const deletado = 0;

        const strsql = `insert into BANCO (
                numero,
                descricao,
                ispb,
                deletado
            ) OUTPUT INSERTED.banco_id VALUES (
                '${numero}',
                '${descricao}',
                '${ispb}',
                ${deletado}
            )`;
        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', banco_id: result[0].banco_id }]);
    },

    async update(request, response) {
        const { banco_id } = request.params;
        const {
            numero,
            descricao,
            ispb,
        } = request.body;

        const strsql = `update BANCO set 
                BANCO.numero = '${numero}',
                BANCO.descricao = '${descricao}',
                BANCO.ispb = '${ispb}'
            where banco_id = ${banco_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};