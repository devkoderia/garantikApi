const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async busca(request, response) {
        const { cliente_id, descricao } = request.body;

        const strsql = `select 
            PRODUTOR.produtor_id as id,
            concat(PRODUTOR.nome, PRODUTOR.razaoSocial) + ' - ' + concat(PRODUTOR.cpf, PRODUTOR.cnpj) as descricao            
            from PRODUTOR
            where (PRODUTOR.deletado = 0 or PRODUTOR.deletado is null) and cliente_id = ${cliente_id} and
            (
                nome like '%${descricao}%' or 
                razaoSocial like '%${descricao}%' or
                nomeFantasia like '%${descricao}%' or
                cpf like '%${descricao}%' or
                cnpj like '%${descricao}%'
            )`;

        try {
            const resultado = await executeQuery(strsql);
            response.status(200).send(resultado);
        } catch (err) {
            response.status(201).json([{ alerta: 'erro', erro: err }]);
        }
    },

    async count(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select count(*) as total from PRODUTOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { produtor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update PRODUTOR set deletado = 1 where produtor_id = ${produtor_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { produtor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            PRODUTOR.produtor_id,
            PRODUTOR.cliente_id,
            PRODUTOR.tipo,
            PRODUTOR.cpf,
            PRODUTOR.cnpj,
            PRODUTOR.nome,
            PRODUTOR.nomeFantasia,
            PRODUTOR.razaoSocial,
            PRODUTOR.cep,
            PRODUTOR.ibge_codigo,
            PRODUTOR.uf,
            PRODUTOR.logradouro,
            PRODUTOR.numero,
            PRODUTOR.complemento,
            PRODUTOR.bairro,
            PRODUTOR.telefoneFixo,
            PRODUTOR.telefoneCelular,
            PRODUTOR.email,
            PRODUTOR.pessoaContato,
            PRODUTOR.emailPessoaContato,
            PRODUTOR.telefoneFixoPessoaContato,
            PRODUTOR.telefoneCelularPessoaContato,
            PRODUTOR.observacao,
            PRODUTOR.comissaoPorcentagem,
            PRODUTOR.premioMinimo,
            PRODUTOR.cnae,
            PRODUTOR.cnaeDescricao,
            PRODUTOR.capitalSocial,
            PRODUTOR.naturezaJuridica,
            PRODUTOR.situacao,
            PRODUTOR.dataAbertura,
            PRODUTOR.dataUltimaAtualizacao,
            PRODUTOR.tipoEmpresa,
            PRODUTOR.porte,
            PRODUTOR.dataSituacao,
            PRODUTOR.motivoSituacao,
            PRODUTOR.situacaoEspecial,
            PRODUTOR.dataSituacaoEspecial,
            PRODUTOR.susep,
            PRODUTOR.bloqueado,
            CONVERT(VARCHAR, PRODUTOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, PRODUTOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.ad_upd, 8) as ad_upd,
            PRODUTOR.ad_usr,
            PRODUTOR.deletado
            from PRODUTOR
            where (PRODUTOR.deletado = 0 or PRODUTOR.deletado is null) and produtor_id = ${produtor_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            PRODUTOR.produtor_id,
            PRODUTOR.cliente_id,
            PRODUTOR.tipo,
            PRODUTOR.cpf,
            PRODUTOR.cnpj,
            PRODUTOR.nome,
            PRODUTOR.nomeFantasia,
            PRODUTOR.razaoSocial,
            PRODUTOR.cep,
            PRODUTOR.ibge_codigo,
            PRODUTOR.uf,
            PRODUTOR.logradouro,
            PRODUTOR.numero,
            PRODUTOR.complemento,
            PRODUTOR.bairro,
            PRODUTOR.telefoneFixo,
            PRODUTOR.telefoneCelular,
            PRODUTOR.email,
            PRODUTOR.pessoaContato,
            PRODUTOR.emailPessoaContato,
            PRODUTOR.telefoneFixoPessoaContato,
            PRODUTOR.telefoneCelularPessoaContato,
            PRODUTOR.observacao,
            PRODUTOR.comissaoPorcentagem,
            PRODUTOR.premioMinimo,
            PRODUTOR.cnae,
            PRODUTOR.cnaeDescricao,
            PRODUTOR.capitalSocial,
            PRODUTOR.naturezaJuridica,
            PRODUTOR.situacao,
            PRODUTOR.dataAbertura,
            PRODUTOR.dataUltimaAtualizacao,
            PRODUTOR.tipoEmpresa,
            PRODUTOR.porte,
            PRODUTOR.dataSituacao,
            PRODUTOR.motivoSituacao,
            PRODUTOR.situacaoEspecial,
            PRODUTOR.dataSituacaoEspecial,
            PRODUTOR.susep,
            PRODUTOR.bloqueado,
            CONVERT(VARCHAR, PRODUTOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, PRODUTOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.ad_upd, 8) as ad_upd,
            PRODUTOR.ad_usr,
            PRODUTOR.deletado
            from PRODUTOR
            where (PRODUTOR.deletado = 0 or PRODUTOR.deletado is null) and cliente_id = ${cliente_id}`;

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
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
            observacao,
            comissaoPorcentagem,
            premioMinimo,
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
            susep,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into PRODUTOR (
            cliente_id,
            tipo,
            cpf,
            cnpj,
            nome,
            nomeFantasia,
            razaoSocial,
            cep,
            ibge_codigo,
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
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
            observacao,
            comissaoPorcentagem,
            premioMinimo,
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
            susep,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${tipo},
            ${cpf},
            ${cnpj},
            '${nome}',
            '${nomeFantasia}',
            '${razaoSocial}',
            '${cep}',
            '${ibge_codigo}',
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
            '${telefoneFixoPessoaContato}',
            '${telefoneCelularPessoaContato}',
            '${observacao}',
            ${comissaoPorcentagem},
            ${premioMinimo},
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
            '${susep}',
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { produtor_id } = request.params;

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
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
            observacao,
            comissaoPorcentagem,
            premioMinimo,
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
            susep,
            ad_usr,
            bloqueado
        } = request.body;

        if (!bloqueado) bloqueado = 0;
        if (!premioMinimo) premioMinimo = 0;
        if (!comissaoPorcentagem) comissaoPorcentagem = 0;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update PRODUTOR set 
            tipo = ${tipo},
            cpf = '${cpf}',
            cnpj = '${cnpj}',
            nome = '${nome}',
            nomeFantasia = '${nomeFantasia}',
            razaoSocial = '${razaoSocial}',
            cep = '${cep}',
            ibge_codigo = '${ibge_codigo}',
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
            telefoneFixoPessoaContato = '${telefoneFixoPessoaContato}',
            telefoneCelularPessoaContato = '${telefoneCelularPessoaContato}',
            observacao = '${observacao}',
            comissaoPorcentagem = ${comissaoPorcentagem},
            premioMinimo = ${premioMinimo},
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
            susep = '${susep}',
            bloqueado = ${bloqueado},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where produtor_id = ${produtor_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);

    }
};