const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `
            SELECT count(*) as total 
            FROM CLIENTE_USUARIO 
            WHERE (deletado = 0 OR deletado IS NULL) and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { clienteUsuario_id } = request.params;

        const strsql = `
            UPDATE CLIENTE_USUARIO 
            SET deletado = 1 
            WHERE clienteUsuario_id = ${clienteUsuario_id}
        `;
        
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { clienteUsuario_id } = request.params;
        const strsql = `
            SELECT 
                clienteUsuario_id,
                cliente_id,
                usuario_id,
                status,
                CONVERT(VARCHAR, ad_new, 103) + ' ' + CONVERT(VARCHAR, ad_new, 8) AS ad_new,
                CONVERT(VARCHAR, ad_upd, 103) + ' ' + CONVERT(VARCHAR, ad_upd, 8) AS ad_upd,
                bloqueado,
                deletado
            FROM CLIENTE_USUARIO
            WHERE (deletado = 0 OR deletado IS NULL)
              AND clienteUsuario_id = ${clienteUsuario_id} and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `
            SELECT 
                clienteUsuario_id,
                cliente_id,
                usuario_id,
                status,
                CONVERT(VARCHAR, ad_new, 103) + ' ' + CONVERT(VARCHAR, ad_new, 8) AS ad_new,
                CONVERT(VARCHAR, ad_upd, 103) + ' ' + CONVERT(VARCHAR, ad_upd, 8) AS ad_upd,
                bloqueado,
                deletado
            FROM CLIENTE_USUARIO
            WHERE (deletado = 0 OR deletado IS NULL) and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            usuario_id,
        } = request.body;

        // Use default values if not provided
        const bloqueadoValue = bloqueado !== undefined ? bloqueado : 0;
        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:mm:ss');
        const ad_upd = ad_new;
        const status = 'P'

        const strsql = `
            INSERT INTO CLIENTE_USUARIO (
                cliente_id,
                usuario_id,
                status,
                ad_new,
                ad_upd,
                bloqueado,
                deletado
            ) OUTPUT INSERTED.clienteUsuario_id VALUES (
                ${cliente_id},
                ${usuario_id},
                '${status}',
                '${ad_new}',
                '${ad_upd}',
                ${bloqueadoValue},
                ${deletado}
            )
        `;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', clienteUsuario_id: result[0].clienteUsuario_id }]);
    },

    async update(request, response) {
        
        const { clienteUsuario_id } = request.params;
        const {
            cliente_id,
            usuario_id,
            bloqueado,
            status
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:mm:ss');

        const strsql = `
            UPDATE CLIENTE_USUARIO SET 
                cliente_id = ${cliente_id},
                usuario_id = ${usuario_id},
                status = '${status}',
                bloqueado = ${bloqueado},
                ad_upd = '${ad_upd}'
            WHERE clienteUsuario_id = ${clienteUsuario_id}
        `;
            
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};
