const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async listaEmissaoTomador(emissao_id, cliente_id) {

        const strsql = `select 
            TOMADOR.tomador_id,
            TOMADOR.cliente_id,
            TOMADOR.tipoJuridico,
            TOMADOR.cpf,
            TOMADOR.cnpj,
            TOMADOR.nome,
            TOMADOR.nomeFantasia,
            TOMADOR.razaoSocial,
            TOMADOR.cep,
            TOMADOR.ibge_codigo,
            TOMADOR.ibge_descri,
            TOMADOR.uf,
            TOMADOR.logradouro,
            TOMADOR.numero,
            TOMADOR.complemento,
            TOMADOR.bairro,
            TOMADOR.telefoneFixo,
            TOMADOR.telefoneCelular,
            TOMADOR.email,
            TOMADOR.observacao,
            TOMADOR.cnae,
            TOMADOR.cnaeDescricao,
            TOMADOR.capitalSocial,
            TOMADOR.naturezaJuridica,
            TOMADOR.situacao,
            TOMADOR.dataAbertura,
            TOMADOR.dataUltimaAtualizacao,
            TOMADOR.tipoEmpresa,
            TOMADOR.porte,
            TOMADOR.dataSituacao,
            TOMADOR.motivoSituacao,
            TOMADOR.situacaoEspecial,
            TOMADOR.dataSituacaoEspecial,
            case when TOMADOR.restricao = 1 then 1 else 0 end as restricao,
            case when TOMADOR.bloqueado = 1 then 1 else 0 end as bloqueado,
            CONVERT(VARCHAR, TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_upd, 8) as ad_upd,
            TOMADOR.ad_usr,
            TOMADOR.deletado
            from TOMADOR
            inner join EMISSAO_TOMADOR on EMISSAO_TOMADOR.tomador_id = TOMADOR.tomador_id
            where 
            (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and 
            (EMISSAO_TOMADOR.deletado = 0 or EMISSAO_TOMADOR.deletado is null) and             
            EMISSAO_TOMADOR.emissao_id = ${emissao_id} and TOMADOR.cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        
        return resultado
    },

    //----------------------------------------------------------------

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from EMISSAO_TOMADOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { emissaoTomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO_TOMADOR set deletado = 1 where emissaoTomador_id = ${emissaoTomador_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { emissaoTomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            EMISSAO_TOMADOR.emissaoTomador_id,
            EMISSAO_TOMADOR.cliente_id,
            EMISSAO_TOMADOR.emissao_id,
            EMISSAO_TOMADOR.tomador_id,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 8) as ad_upd,
            EMISSAO_TOMADOR.ad_usr,
            EMISSAO_TOMADOR.deletado
            from EMISSAO_TOMADOR
            where (EMISSAO_TOMADOR.deletado = 0 or EMISSAO_TOMADOR.deletado is null) and emissaoTomador_id = ${emissaoTomador_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            EMISSAO_TOMADOR.emissaoTomador_id,
            EMISSAO_TOMADOR.cliente_id,
            EMISSAO_TOMADOR.emissao_id,
            EMISSAO_TOMADOR.tomador_id,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 8) as ad_upd,
            EMISSAO_TOMADOR.ad_usr,
            EMISSAO_TOMADOR.deletado
            from EMISSAO_TOMADOR
            where (EMISSAO_TOMADOR.deletado = 0 or EMISSAO_TOMADOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            emissao_id,
            tomador_id,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into EMISSAO_TOMADOR (
            cliente_id,
            emissao_id,
            tomador_id,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${emissao_id},
            ${tomador_id},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async update(request, response) {
        const { emissaoTomador_id } = request.params;
        const {
            cliente_id,
            emissao_id,
            tomador_id,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EMISSAO_TOMADOR set 
            cliente_id = ${cliente_id},
            emissao_id = ${emissao_id},
            tomador_id = ${tomador_id},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where emissaoTomador_id = ${emissaoTomador_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};