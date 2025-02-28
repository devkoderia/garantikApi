const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(_, response) {
        const strsql = `select count(*) as total from CORRETOR_FUNCIONARIO where (deletado = 0 or deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {
        const { corretorFuncionario_id } = request.params;
        const strsql = `update CORRETOR_FUNCIONARIO set deletado = 1 where corretorFuncionario_id = ${corretorFuncionario_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { corretorFuncionario_id } = request.params;
        const strsql = `select 
                CORRETOR_FUNCIONARIO.corretorFuncionario_id,
                CORRETOR_FUNCIONARIO.cliente_id,
                CORRETOR_FUNCIONARIO.corretor_id,
                CORRETOR_FUNCIONARIO.nome,
                CORRETOR_FUNCIONARIO.cargo,
                CORRETOR_FUNCIONARIO.aniversario,
                CORRETOR_FUNCIONARIO.celular,
                CORRETOR_FUNCIONARIO.email,
                CORRETOR_FUNCIONARIO.observacao,
                CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_upd, 8) as ad_upd,
                CORRETOR_FUNCIONARIO.ad_usr,
                CORRETOR_FUNCIONARIO.deletado
            from CORRETOR_FUNCIONARIO
            where (CORRETOR_FUNCIONARIO.deletado = 0 or CORRETOR_FUNCIONARIO.deletado is null) and corretorFuncionario_id = ${corretorFuncionario_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(_, response) {
        const strsql = `select 
                CORRETOR_FUNCIONARIO.corretorFuncionario_id,
                CORRETOR_FUNCIONARIO.cliente_id,
                CORRETOR_FUNCIONARIO.corretor_id,
                CORRETOR_FUNCIONARIO.nome,
                CORRETOR_FUNCIONARIO.cargo,
                CORRETOR_FUNCIONARIO.aniversario,
                CORRETOR_FUNCIONARIO.celular,
                CORRETOR_FUNCIONARIO.email,
                CORRETOR_FUNCIONARIO.observacao,
                CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR_FUNCIONARIO.ad_upd, 8) as ad_upd,
                CORRETOR_FUNCIONARIO.ad_usr,
                CORRETOR_FUNCIONARIO.deletado
            from CORRETOR_FUNCIONARIO
            where (CORRETOR_FUNCIONARIO.deletado = 0 or CORRETOR_FUNCIONARIO.deletado is null)`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            corretor_id,
            nome,
            cargo,
            aniversario,
            celular,
            email,
            observacao,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into CORRETOR_FUNCIONARIO (
                cliente_id,
                corretor_id,
                nome,
                cargo,
                aniversario,
                celular,
                email,
                observacao,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.corretorFuncionario_id VALUES (
                ${cliente_id},
                ${corretor_id},
                '${nome}',
                '${cargo}',
                '${aniversario}',
                '${celular}',
                '${email}',
                '${observacao}',
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', corretorFuncionario_id: result[0].corretorFuncionario_id }]);
    },

    async update(request, response) {
        const { corretorFuncionario_id } = request.params;
        const {
            cliente_id,
            corretor_id,
            nome,
            cargo,
            aniversario,
            celular,
            email,
            observacao,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update CORRETOR_FUNCIONARIO set 
                CORRETOR_FUNCIONARIO.cliente_id = ${cliente_id},
                CORRETOR_FUNCIONARIO.corretor_id = ${corretor_id},
                CORRETOR_FUNCIONARIO.nome = '${nome}',
                CORRETOR_FUNCIONARIO.cargo = '${cargo}',
                CORRETOR_FUNCIONARIO.aniversario = '${aniversario}',
                CORRETOR_FUNCIONARIO.celular = '${celular}',
                CORRETOR_FUNCIONARIO.email = '${email}',
                CORRETOR_FUNCIONARIO.observacao = '${observacao}',
                CORRETOR_FUNCIONARIO.ad_upd = '${ad_upd}',
                CORRETOR_FUNCIONARIO.ad_usr = ${ad_usr}
            where corretorFuncionario_id = ${corretorFuncionario_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};