const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async busca(request, response) {

        const { cliente_id, descricao } = request.body;
        
        const strsql = `select 
            CORRETOR.corretor_id as id,
            concat(CORRETOR.nome, CORRETOR.razaoSocial) + ' - ' + concat(CORRETOR.cpf, CORRETOR.cnpj) as descricao
            from CORRETOR
            where (CORRETOR.deletado = 0 or CORRETOR.deletado is null) and cliente_id = ${cliente_id} and
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

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from CORRETOR where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { corretor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update CORRETOR set deletado = 1 where corretor_id = ${corretor_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { corretor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                
                CORRETOR.corretor_id,
                CORRETOR.cliente_id,
                CORRETOR.produtor_id,
                CORRETOR.tipoJuridico,
                CORRETOR.cpf,
                CORRETOR.cnpj,
                CORRETOR.nome,
                CORRETOR.nomeFantasia,
                CORRETOR.razaoSocial,
                CORRETOR.naturezaJuridica,
                CORRETOR.tipoEmpresa,
                CORRETOR.porte,
                CORRETOR.capitalSocial,
                CORRETOR.cnae,
                CORRETOR.cnaeDescricao,
                CORRETOR.situacao,
                CORRETOR.dataSituacao,
                CORRETOR.motivoSituacao,
                CORRETOR.situacaoEspecial,
                CORRETOR.dataSituacaoEspecial,
                CORRETOR.dataAbertura,
                CORRETOR.dataUltimaAtualizacao,
                CORRETOR.cep,
                CORRETOR.ibge_codigo,
                CORRETOR.ibge_descri,
                CORRETOR.uf,
                CORRETOR.logradouro,
                CORRETOR.numero,
                CORRETOR.complemento,
                CORRETOR.bairro,
                CORRETOR.telefoneFixo,
                CORRETOR.telefoneCelular,
                CORRETOR.email,
                CORRETOR.nacionalidade_id,
                CORRETOR.estadoCivil,
                CORRETOR.profissao,

                CORRETOR.banco_id,
                CORRETOR.agencia,
                CORRETOR.numeroConta,
                CORRETOR.tipoConta,
                CORRETOR.chavePix,
                CORRETOR.cpfCorrentista,
                CORRETOR.cnpjCorrentista,

                CORRETOR.pessoaContato,
                CORRETOR.emailPessoaContato,
                CORRETOR.telefoneFixoPessoaContato,
                CORRETOR.telefoneCelularPessoaContato,
                CORRETOR.comissaoPorcentagem,
                CORRETOR.premioMinimo,
                CORRETOR.susep,
                CORRETOR.observacao,
                CORRETOR.bloqueado,
                CONVERT(VARCHAR, CORRETOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.ad_upd, 8) as ad_upd,
                CORRETOR.ad_usr,
                USUARIO.nome as nomeUsuario,
                CORRETOR.deletado
            from CORRETOR
            inner join USUARIO on USUARIO.usuario_id = CORRETOR.ad_usr
            where (CORRETOR.deletado = 0 or CORRETOR.deletado is null) and CORRETOR.corretor_id = ${corretor_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
                CORRETOR.corretor_id,
                CORRETOR.cliente_id,
                CORRETOR.produtor_id,
                CORRETOR.tipoJuridico,
                CORRETOR.cpf,
                CORRETOR.cnpj,
                CORRETOR.nome,
                CORRETOR.nomeFantasia,
                CORRETOR.razaoSocial,
                CORRETOR.cep,
                CORRETOR.ibge_codigo,
                CORRETOR.ibge_descri,
                CORRETOR.uf,
                CORRETOR.logradouro,
                CORRETOR.numero,
                CORRETOR.complemento,
                CORRETOR.bairro,
                CORRETOR.telefoneFixo,
                CORRETOR.telefoneCelular,
                CORRETOR.email,
                CORRETOR.nacionalidade_id,
                CORRETOR.estadoCivil,
                CORRETOR.profissao,

                CORRETOR.banco_id,
                CORRETOR.agencia,
                CORRETOR.numeroConta,
                CORRETOR.tipoConta,
                CORRETOR.chavePix,
                CORRETOR.cpfCorrentista,
                CORRETOR.cnpjCorrentista,

                CORRETOR.pessoaContato,
                CORRETOR.emailPessoaContato,
                CORRETOR.telefoneFixoPessoaContato,
                CORRETOR.telefoneCelularPessoaContato,
                CORRETOR.observacao,
                CORRETOR.comissaoPorcentagem,
                CORRETOR.premioMinimo,
                CORRETOR.cnae,
                CORRETOR.cnaeDescricao,
                CORRETOR.capitalSocial,
                CORRETOR.naturezaJuridica,
                CORRETOR.situacao,
                CORRETOR.dataAbertura,
                CORRETOR.dataUltimaAtualizacao,
                CORRETOR.tipoEmpresa,
                CORRETOR.porte,
                CORRETOR.dataSituacao,
                CORRETOR.motivoSituacao,
                CORRETOR.situacaoEspecial,
                CORRETOR.dataSituacaoEspecial,
                CORRETOR.susep,
                CORRETOR.bloqueado,
                CONVERT(VARCHAR, CORRETOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CORRETOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.ad_upd, 8) as ad_upd,
                CORRETOR.ad_usr,
                CORRETOR.deletado
            from CORRETOR
            where (CORRETOR.deletado = 0 or CORRETOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTabela(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            CORRETOR.corretor_id as id,
            concat(CORRETOR.nome, CORRETOR.razaoSocial) as descricao,
            concat(CORRETOR.cpf, CORRETOR.cnpj) as documento,
            CORRETOR.uf,
            CORRETOR.ibge_descri,
            CONCAT('', 
            CASE WHEN LEN(CORRETOR.telefoneCelular) = 0 THEN CORRETOR.telefoneFixo ELSE CONCAT(CORRETOR.telefoneFixo,' / ',CORRETOR.telefoneCelular) END) as telefone
            from CORRETOR
            where (CORRETOR.deletado = 0 or CORRETOR.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTomador(request, response) {

        const { cliente_id, tomador_id } = request.body;

        const strsql = `select 
            CORRETOR.corretor_id as id,
            concat(CORRETOR.nome, CORRETOR.razaoSocial) as descricao,
            concat(CORRETOR.cpf, CORRETOR.cnpj) as documento
            from CORRETOR
            inner join TOMADOR_CORRETOR on TOMADOR_CORRETOR.corretor_id = CORRETOR.corretor_id
            where 
            (CORRETOR.deletado = 0 or CORRETOR.deletado is null) and 
            (TOMADOR_CORRETOR.deletado = 0 or TOMADOR_CORRETOR.deletado is null) and 
            CORRETOR.cliente_id = ${cliente_id} and
            TOMADOR_CORRETOR.tomador_id = ${tomador_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            produtor_id,
            tipoJuridico,
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
            nacionalidade_id,
            estadoCivil,
            profissao,

            banco_id,
            agencia,
            numeroConta,
            tipoConta,
            chavePix,
            cpfCorrentista,
            cnpjCorrentista,

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
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        // Resolve errors
        /*
        if (!cpf) cpf = null;
        if (!cnpj) cnpj = null;
        if (!premioMinimo) {premioMinimo = 0}
        if (!comissaoPorcentagem) {comissaoPorcentagem = 0}
        */

        const strsql = `insert into CORRETOR (
                cliente_id,
                produtor_id,
                tipoJuridico,
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
                nacionalidade_id,
                estadoCivil,
                profissao,

                banco_id,
                agencia,
                numeroConta,
                tipoConta,
                chavePix,
                cpfCorrentista,
                cnpjCorrentista,

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
                deletado,
                bloqueado
            ) OUTPUT INSERTED.corretor_id VALUES (
                ${cliente_id},
                ${produtor_id},
                '${tipoJuridico}',
                ${cpf ? `'${cpf}'` : null},
                ${cnpj ? `'${cnpj}'` : null},
                '${nome.toUpperCase()}',
                '${nomeFantasia.toUpperCase()}',
                '${razaoSocial.toUpperCase()}',
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
                ${nacionalidade_id},
                '${estadoCivil}',
                '${profissao}',
                ${banco_id},
                '${agencia}',
                '${numeroConta}',
                '${tipoConta}',
                '${chavePix}',
                ${cpfCorrentista ? `'${cpfCorrentista}'` : null},
                ${cnpjCorrentista ? `'${cnpjCorrentista}'` : null},
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
                0,
                0
            )`;

        console.log(strsql)
        //return false

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', corretor_id: result[0].corretor_id }]);
    },

    async update(request, response) {
        
        const { corretor_id } = request.params;

        const {
            cliente_id,
            produtor_id,
            tipoJuridico,
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
            nacionalidade_id,
            estadoCivil,
            profissao,

            banco_id,
            agencia,
            numeroConta,
            tipoConta,
            chavePix,
            cpfCorrentista,
            cnpjCorrentista,

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

        const strsql = `update CORRETOR set 
                CORRETOR.cliente_id = ${cliente_id},
                CORRETOR.produtor_id = ${produtor_id},
                CORRETOR.tipoJuridico = '${tipoJuridico}',
                CORRETOR.cpf = '${cpf}',
                CORRETOR.cnpj = '${cnpj}',
                CORRETOR.nome = '${nome.toUpperCase()}',
                CORRETOR.nomeFantasia = '${nomeFantasia.toUpperCase()}',
                CORRETOR.razaoSocial = '${razaoSocial.toUpperCase()}',
                CORRETOR.cep = '${cep}',
                CORRETOR.ibge_codigo = '${ibge_codigo}',
                CORRETOR.ibge_descri = '${ibge_descri}',
                CORRETOR.uf = '${uf}',
                CORRETOR.logradouro = '${logradouro}',
                CORRETOR.numero = '${numero}',
                CORRETOR.complemento = '${complemento}',
                CORRETOR.bairro = '${bairro}',
                CORRETOR.telefoneFixo = '${telefoneFixo}',
                CORRETOR.telefoneCelular = '${telefoneCelular}',
                CORRETOR.email = '${email}',
                CORRETOR.nacionalidade_id = ${nacionalidade_id},
                CORRETOR.estadoCivil = '${estadoCivil}',
                CORRETOR.profissao = '${profissao}',

                CORRETOR.banco_id = ${banco_id},
                CORRETOR.agencia = '${agencia}',
                CORRETOR.numeroConta = '${numeroConta}',
                CORRETOR.tipoConta = '${tipoConta}',
                CORRETOR.chavePix = '${chavePix}',
                CORRETOR.cpfCorrentista = '${cpfCorrentista}',
                CORRETOR.cnpjCorrentista = '${cnpjCorrentista}',

                CORRETOR.pessoaContato = '${pessoaContato}',
                CORRETOR.emailPessoaContato = '${emailPessoaContato}',
                CORRETOR.telefoneFixoPessoaContato = '${telefoneFixoPessoaContato}',
                CORRETOR.telefoneCelularPessoaContato = '${telefoneCelularPessoaContato}',
                CORRETOR.observacao = '${observacao}',
                CORRETOR.comissaoPorcentagem = ${comissaoPorcentagem},
                CORRETOR.premioMinimo = ${premioMinimo},
                CORRETOR.cnae = '${cnae}',
                CORRETOR.cnaeDescricao = '${cnaeDescricao}',
                CORRETOR.capitalSocial = '${capitalSocial}',
                CORRETOR.naturezaJuridica = '${naturezaJuridica}',
                CORRETOR.situacao = '${situacao}',
                CORRETOR.dataAbertura = '${dataAbertura}',
                CORRETOR.dataUltimaAtualizacao = '${dataUltimaAtualizacao}',
                CORRETOR.tipoEmpresa = '${tipoEmpresa}',
                CORRETOR.porte = '${porte}',
                CORRETOR.dataSituacao = '${dataSituacao}',
                CORRETOR.motivoSituacao = '${motivoSituacao}',
                CORRETOR.situacaoEspecial = '${situacaoEspecial}',
                CORRETOR.dataSituacaoEspecial = '${dataSituacaoEspecial}',
                CORRETOR.susep = '${susep}',
                CORRETOR.bloqueado = ${bloqueado},
                CORRETOR.ad_upd = '${ad_upd}',
                CORRETOR.ad_usr = ${ad_usr}
            where corretor_id = ${corretor_id} and cliente_id = ${cliente_id}`;

        console.log(strsql)
        
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};