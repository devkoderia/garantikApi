const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from MODALIDADE where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
        
    },

    async destroy(request, response) {

        const { modalidade_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update MODALIDADE set deletado = 1 where modalidade_id = ${modalidade_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    },

    async listaUm(request, response) {

        const { modalidade_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            MODALIDADE.modalidade_id,
            MODALIDADE.cliente_id,
            MODALIDADE.descricao,
            MODALIDADE.texto,
            MODALIDADE.status
            
            from MODALIDADE
            where (MODALIDADE.deletado = 0 or MODALIDADE.deletado is null) and modalidade_id = ${modalidade_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);

    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            MODALIDADE.modalidade_id,
            MODALIDADE.cliente_id,
            MODALIDADE.descricao,
            MODALIDADE.texto,
            MODALIDADE.status            
            from MODALIDADE
            where (MODALIDADE.deletado = 0 or MODALIDADE.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);

    },

    async create(request, response) {

        const {
            cliente_id,
            descricao,
            texto,
            ad_usr,
            status,
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into MODALIDADE (
            cliente_id,
            descricao,
            texto,
            ad_new,
            ad_upd,
            ad_usr,
            deletado,
            status
        ) VALUES (
            ${cliente_id},
            '${descricao}',
            '${texto}',
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado},
            '${status}'
        )`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    },

    async update(request, response) {

        const { modalidade_id } = request.params;

        const {
            cliente_id,
            descricao,
            texto,
            ad_usr,
            status,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update MODALIDADE set 
            descricao = '${descricao}',
            texto = '${texto}',
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr},
            status = '${status}'
            where modalidade_id = ${modalidade_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    }
};