const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from FINANCEIRO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { financeiro_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update FINANCEIRO set deletado = 1 where financeiro_id = ${financeiro_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { financeiro_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            FINANCEIRO.financeiro_id,
            FINANCEIRO.cliente_id,
            FINANCEIRO.formaPagamento_id,
            FINANCEIRO.corretor_id,
            FINANCEIRO.produtor_id,
            FINANCEIRO.pix_id,
            FINANCEIRO.banco_id,
            FINANCEIRO.agencia,
            FINANCEIRO.conta,
            FINANCEIRO.cpf,
            FINANCEIRO.cnpj,
            FINANCEIRO.nome,
            FINANCEIRO.razaoSocial,
            FINANCEIRO.pixCnpj,
            FINANCEIRO.pixCpf,
            FINANCEIRO.pixCelular,
            FINANCEIRO.pixEmail,
            FINANCEIRO.pixAleatorio,
            CONVERT(VARCHAR, FINANCEIRO.ad_new, 103) + ' ' + CONVERT(VARCHAR, FINANCEIRO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, FINANCEIRO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, FINANCEIRO.ad_upd, 8) as ad_upd,
            FINANCEIRO.ad_usr,
            FINANCEIRO.deletado
            from FINANCEIRO
            where (FINANCEIRO.deletado = 0 or FINANCEIRO.deletado is null) and financeiro_id = ${financeiro_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            FINANCEIRO.financeiro_id,
            FINANCEIRO.cliente_id,
            FINANCEIRO.formaPagamento_id,
            FINANCEIRO.corretor_id,
            FINANCEIRO.produtor_id,
            FINANCEIRO.pix_id,
            FINANCEIRO.banco_id,
            FINANCEIRO.agencia,
            FINANCEIRO.conta,
            FINANCEIRO.cpf,
            FINANCEIRO.cnpj,
            FINANCEIRO.nome,
            FINANCEIRO.razaoSocial,
            FINANCEIRO.pixCnpj,
            FINANCEIRO.pixCpf,
            FINANCEIRO.pixCelular,
            FINANCEIRO.pixEmail,
            FINANCEIRO.pixAleatorio,
            CONVERT(VARCHAR, FINANCEIRO.ad_new, 103) + ' ' + CONVERT(VARCHAR, FINANCEIRO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, FINANCEIRO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, FINANCEIRO.ad_upd, 8) as ad_upd,
            FINANCEIRO.ad_usr,
            FINANCEIRO.deletado
            from FINANCEIRO
            where (FINANCEIRO.deletado = 0 or FINANCEIRO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            formaPagamento_id,
            corretor_id,
            produtor_id,
            pix_id,
            banco_id,
            agencia,
            conta,
            cpf,
            cnpj,
            nome,
            razaoSocial,
            pixCnpj,
            pixCpf,
            pixCelular,
            pixEmail,
            pixAleatorio,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into FINANCEIRO (
            cliente_id,
            formaPagamento_id,
            corretor_id,
            produtor_id,
            pix_id,
            banco_id,
            agencia,
            conta,
            cpf,
            cnpj,
            nome,
            razaoSocial,
            pixCnpj,
            pixCpf,
            pixCelular,
            pixEmail,
            pixAleatorio,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${formaPagamento_id},
            ${corretor_id},
            ${produtor_id},
            ${pix_id},
            ${banco_id},
            '${agencia}',
            '${conta}',
            '${cpf}',
            '${cnpj}',
            '${nome}',
            '${razaoSocial}',
            '${pixCnpj}',
            '${pixCpf}',
            '${pixCelular}',
            '${pixEmail}',
            '${pixAleatorio}',
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { financeiro_id } = request.params;

        const {
            cliente_id,
            formaPagamento_id,
            corretor_id,
            produtor_id,
            pix_id,
            banco_id,
            agencia,
            conta,
            cpf,
            cnpj,
            nome,
            razaoSocial,
            pixCnpj,
            pixCpf,
            pixCelular,
            pixEmail,
            pixAleatorio,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update FINANCEIRO set 
            formaPagamento_id = ${formaPagamento_id},
            corretor_id = ${corretor_id},
            produtor_id = ${produtor_id},
            pix_id = ${pix_id},
            banco_id = ${banco_id},
            agencia = '${agencia}',
            conta = '${conta}',
            cpf = '${cpf}',
            cnpj = '${cnpj}',
            nome = '${nome}',
            razaoSocial = '${razaoSocial}',
            pixCnpj = '${pixCnpj}',
            pixCpf = '${pixCpf}',
            pixCelular = '${pixCelular}',
            pixEmail = '${pixEmail}',
            pixAleatorio = '${pixAleatorio}',
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where financeiro_id = ${financeiro_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};