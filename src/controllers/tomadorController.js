const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async verificaDuplicidade(request, response) {
        const { cliente_id, documento } = request.body;

        const strsql = `select tomador_id from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and 
            cliente_id = ${cliente_id} and 
            (cpf = '${documento}' or cnpj = '${documento}')`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async busca(request, response) {

        const { cliente_id, descricao } = request.body;

        const strsql = `select 
            TOMADOR.tomador_id as id,
            concat(TOMADOR.nome, TOMADOR.razaoSocial) + ' - ' + concat(TOMADOR.cpf, TOMADOR.cnpj) as descricao
            from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and cliente_id = ${cliente_id} and
            (
                nome like '%${descricao}%' or 
                razaoSocial like '%${descricao}%' or
                nomeFantasia like '%${descricao}%' or
                cpf like '%${descricao}%' or
                cnpj like '%${descricao}%'
            )`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTabela(_, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            TOMADOR.tomador_id as id,
            concat(TOMADOR.nome, TOMADOR.razaoSocial) as descricao,
            concat(TOMADOR.cpf, TOMADOR.cnpj) as documento,
            TOMADOR.uf,
            TOMADOR.ibge_descri,
            CONCAT('', 
                CASE WHEN LEN(TOMADOR.telefoneCelular) = 0 THEN TOMADOR.telefoneFixo ELSE CONCAT(TOMADOR.telefoneFixo,' / ',TOMADOR.telefoneCelular) END) as telefone
            from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from TOMADOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { tomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update TOMADOR set deletado = 1 where tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {
        const { tomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            TOMADOR.tomador_id,
            TOMADOR.cliente_id,
            TOMADOR.tipo,
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
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            TOMADOR.tomador_id,
            TOMADOR.cliente_id,
            TOMADOR.tipo,
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
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is null) and cliente_id = ${cliente_id}`;
            
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            tipo,
            cpf,
            cnpj,
            nome,
            nomeFantasia,
            razaoSocial,
            cep,
            ibge_codigo,
            ibge_descri,
            uf,
            logradouro,
            numero,
            complemento,
            bairro,
            telefoneFixo,
            telefoneCelular,
            email,
            pessoaContato,
            emailPessoaContato,
            observacao,
            cnae,
            cnaeDescricao,
            capitalSocial,
            naturezaJuridica,
            situacao,
            dataAbertura,
            dataUltimaAtualizacao,
            tipoEmpresa,
            porte,
            dataSituacao,
            motivoSituacao,
            situacaoEspecial,
            dataSituacaoEspecial,
            restricao,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into TOMADOR (
            cliente_id,
            tipo,
            cpf,
            cnpj,
            nome,
            nomeFantasia,
            razaoSocial,
            cep,
            ibge_codigo,
            ibge_descri,
            uf,
            logradouro,
            numero,
            complemento,
            bairro,
            telefoneFixo,
            telefoneCelular,
            email,
            pessoaContato,
            emailPessoaContato,
            observacao,
            cnae,
            cnaeDescricao,
            capitalSocial,
            naturezaJuridica,
            situacao,
            dataAbertura,
            dataUltimaAtualizacao,
            tipoEmpresa,
            porte,
            dataSituacao,
            motivoSituacao,
            situacaoEspecial,
            dataSituacaoEspecial,
            restricao,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) OUTPUT INSERTED.tomador_id VALUES (
            ${cliente_id},
            ${tipo},
            '${cpf}',
            '${cnpj}',
            '${nome}',
            '${nomeFantasia}',
            '${razaoSocial}',
            '${cep}',
            '${ibge_codigo}',
            '${ibge_descri}',
            '${uf}',
            '${logradouro}',
            '${numero}',
            '${complemento}',
            '${bairro}',
            '${telefoneFixo}',
            '${telefoneCelular}',
            '${email}',
            '${pessoaContato}',
            '${emailPessoaContato}',
            '${observacao}',
            '${cnae}',
            '${cnaeDescricao}',
            '${capitalSocial}',
            '${naturezaJuridica}',
            '${situacao}',
            '${dataAbertura}',
            '${dataUltimaAtualizacao}',
            '${tipoEmpresa}',
            '${porte}',
            '${dataSituacao}',
            '${motivoSituacao}',
            '${situacaoEspecial}',
            '${dataSituacaoEspecial}',
            0,
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            0
        )`;

        const resultado = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', tomador_id: resultado[0]?.tomador_id }]);
    },

    async update(request, response) {

        const { tomador_id } = request.params;

        const {
            cliente_id,
            tipo,
            cpf,
            cnpj,
            nome,
            nomeFantasia,
            razaoSocial,
            cep,
            ibge_codigo,
            ibge_descri,
            uf,
            logradouro,
            numero,
            complemento,
            bairro,
            telefoneFixo,
            telefoneCelular,
            email,
            pessoaContato,
            emailPessoaContato,
            observacao,
            cnae,
            cnaeDescricao,
            capitalSocial,
            naturezaJuridica,
            situacao,
            dataAbertura,
            dataUltimaAtualizacao,
            tipoEmpresa,
            porte,
            dataSituacao,
            motivoSituacao,
            situacaoEspecial,
            dataSituacaoEspecial,
            restricao,
            ad_usr,
            bloqueado
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update TOMADOR set             
            tipo = ${tipo},
            cpf = '${cpf}',
            cnpj = '${cnpj}',
            nome = '${nome}',
            nomeFantasia = '${nomeFantasia}',
            razaoSocial = '${razaoSocial}',
            cep = '${cep}',
            ibge_codigo = '${ibge_codigo}',
            ibge_descri = '${ibge_descri}',
            uf = '${uf}',
            logradouro = '${logradouro}',
            numero = '${numero}',
            complemento = '${complemento}',
            bairro = '${bairro}',
            telefoneFixo = '${telefoneFixo}',
            telefoneCelular = '${telefoneCelular}',
            email = '${email}',
            pessoaContato = '${pessoaContato}',
            emailPessoaContato = '${emailPessoaContato}',
            observacao = '${observacao}',
            cnae = '${cnae}',
            cnaeDescricao = '${cnaeDescricao}',
            capitalSocial = '${capitalSocial}',
            naturezaJuridica = '${naturezaJuridica}',
            situacao = '${situacao}',
            dataAbertura = '${dataAbertura}',
            dataUltimaAtualizacao = '${dataUltimaAtualizacao}',
            tipoEmpresa = '${tipoEmpresa}',
            porte = '${porte}',
            dataSituacao = '${dataSituacao}',
            motivoSituacao = '${motivoSituacao}',
            situacaoEspecial = '${situacaoEspecial}',
            dataSituacaoEspecial = '${dataSituacaoEspecial}',
            restricao = ${restricao || 0},
            bloqueado = ${bloqueado || 0},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};