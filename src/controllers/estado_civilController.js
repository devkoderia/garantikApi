const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from ESTADO_CIVIL where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { estadoCivil_id } = request.params;
        const strsql = `update ESTADO_CIVIL set deletado = 1 where estadoCivil_id = ${estadoCivil_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { estadoCivil_id } = request.params;
        const strsql = `select 
            ESTADO_CIVIL.estadoCivil_id,
            ESTADO_CIVIL.descricao
            from ESTADO_CIVIL
            where (ESTADO_CIVIL.deletado = 0 or ESTADO_CIVIL.deletado is null) and estadoCivil_id = ${estadoCivil_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
            ESTADO_CIVIL.estadoCivil_id,
            ESTADO_CIVIL.descricao
            from ESTADO_CIVIL
            where (ESTADO_CIVIL.deletado = 0 or ESTADO_CIVIL.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const { descricao } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into ESTADO_CIVIL (
            descricao
        ) VALUES (
            '${descricao}'
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {
        const { estadoCivil_id } = request.params;
        const { descricao } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update ESTADO_CIVIL set 
            descricao = '${descricao}'
            where estadoCivil_id = ${estadoCivil_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};