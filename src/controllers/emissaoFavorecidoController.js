const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from EMISSAO_FAVORECIDO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { emissaoFavorecido_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO_FAVORECIDO set deletado = 1 where emissaoFavorecido_id = ${emissaoFavorecido_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { emissaoFavorecido_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            EMISSAO_FAVORECIDO.emissaoFavorecido_id,
            EMISSAO_FAVORECIDO.cliente_id,
            EMISSAO_FAVORECIDO.emissao_id,
            EMISSAO_FAVORECIDO.favorecido_id,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 8) as ad_upd,
            EMISSAO_FAVORECIDO.ad_usr,
            EMISSAO_FAVORECIDO.deletado
            from EMISSAO_FAVORECIDO
            where (EMISSAO_FAVORECIDO.deletado = 0 or EMISSAO_FAVORECIDO.deletado is null) and emissaoFavorecido_id = ${emissaoFavorecido_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            EMISSAO_FAVORECIDO.emissaoFavorecido_id,
            EMISSAO_FAVORECIDO.cliente_id,
            EMISSAO_FAVORECIDO.emissao_id,
            EMISSAO_FAVORECIDO.favorecido_id,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 8) as ad_upd,
            EMISSAO_FAVORECIDO.ad_usr,
            EMISSAO_FAVORECIDO.deletado
            from EMISSAO_FAVORECIDO
            where (EMISSAO_FAVORECIDO.deletado = 0 or EMISSAO_FAVORECIDO.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            emissao_id,
            favorecido_id,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into EMISSAO_FAVORECIDO (
            cliente_id,
            emissao_id,
            favorecido_id,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${emissao_id},
            ${favorecido_id},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { emissaoFavorecido_id } = request.params;
        
        const {
            cliente_id,
            emissao_id,
            favorecido_id,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EMISSAO_FAVORECIDO set 
            cliente_id = ${cliente_id},
            emissao_id = ${emissao_id},
            favorecido_id = ${favorecido_id},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where emissaoFavorecido_id = ${emissaoFavorecido_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};