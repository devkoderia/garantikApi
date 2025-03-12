const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from CORRETOR_PRODUTOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { corretorProdutor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update CORRETOR_PRODUTOR set deletado = 1 where corretorProdutor_id = ${corretorProdutor_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { corretorProdutor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                CORRETOR_PRODUTOR.corretorProdutor_id,
                CORRETOR_PRODUTOR.cliente_id,
                CORRETOR_PRODUTOR.corretor_id,
                CORRETOR_PRODUTOR.produtor_id,
                CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_upd, 8) as ad_upd,
                CORRETOR_PRODUTOR.ad_usr,
                CORRETOR_PRODUTOR.deletado
            from CORRETOR_PRODUTOR
            where (CORRETOR_PRODUTOR.deletado = 0 or CORRETOR_PRODUTOR.deletado is null) and corretorProdutor_id = ${corretorProdutor_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
                CORRETOR_PRODUTOR.corretorProdutor_id,
                CORRETOR_PRODUTOR.cliente_id,
                CORRETOR_PRODUTOR.corretor_id,
                CORRETOR_PRODUTOR.produtor_id,
                CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_PRODUTOR.ad_upd, 8) as ad_upd,
                CORRETOR_PRODUTOR.ad_usr,
                CORRETOR_PRODUTOR.deletado
            from CORRETOR_PRODUTOR
            where (CORRETOR_PRODUTOR.deletado = 0 or CORRETOR_PRODUTOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            corretor_id,
            produtor_id,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into CORRETOR_PRODUTOR (
                cliente_id,
                corretor_id,
                produtor_id,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.corretorProdutor_id VALUES (
                ${cliente_id},
                ${corretor_id},
                ${produtor_id},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', corretorProdutor_id: result[0].corretorProdutor_id }]);
    },

    async update(request, response) {

        const { corretorProdutor_id } = request.params;
        const {
            cliente_id,
            corretor_id,
            produtor_id,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update CORRETOR_PRODUTOR set 
                CORRETOR_PRODUTOR.cliente_id = ${cliente_id},
                CORRETOR_PRODUTOR.corretor_id = ${corretor_id},
                CORRETOR_PRODUTOR.produtor_id = ${produtor_id},
                CORRETOR_PRODUTOR.ad_upd = '${ad_upd}',
                CORRETOR_PRODUTOR.ad_usr = ${ad_usr}
            where corretorProdutor_id = ${corretorProdutor_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};