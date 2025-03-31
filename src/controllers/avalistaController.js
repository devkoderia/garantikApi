const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select count(*) as total from AVALISTA where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);

        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { avalista_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update AVALISTA set deletado = 1 where avalista_id = ${avalista_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { avalista_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
                AVALISTA.avalista_id,
                AVALISTA.cliente_id,
                AVALISTA.tipo,
                AVALISTA.cpf,
                AVALISTA.cnpj,
                AVALISTA.outroDocumento,
                AVALISTA.nome,
                AVALISTA.nomeFantasia,
                AVALISTA.razaoSocial,
                AVALISTA.cep,
                AVALISTA.ibge_codigo,
                AVALISTA.uf,
                AVALISTA.logradouro,
                AVALISTA.numero,
                AVALISTA.complemento,
                AVALISTA.bairro,
                AVALISTA.telefoneFixo,
                AVALISTA.telefoneCelular,
                AVALISTA.pessoaContato,
                AVALISTA.email,
                AVALISTA.observacao,
                AVALISTA.rg,
                AVALISTA.nacionalidade,
                AVALISTA.estadoCivil_id,
                AVALISTA.expedicao_id,
                AVALISTA.profissao,
                AVALISTA.cnae,
                AVALISTA.cnaeDescricao,
                AVALISTA.capitalSocial,
                AVALISTA.naturezaJuridica,
                AVALISTA.situacao,
                AVALISTA.dataAbertura,
                AVALISTA.dataUltimaAtualizacao,
                AVALISTA.tipoEmpresa,
                AVALISTA.porte,
                AVALISTA.dataSituacao,
                AVALISTA.motivoSituacao,
                AVALISTA.situacaoEspecial,
                AVALISTA.dataSituacaoEspecial,
                AVALISTA.representanteLegal,
                AVALISTA.avalista,
                CONVERT(VARCHAR, AVALISTA.ad_new, 103) + ' ' + CONVERT(VARCHAR, AVALISTA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, AVALISTA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, AVALISTA.ad_upd, 8) as ad_upd,
                AVALISTA.ad_usr,
                AVALISTA.deletado
            from AVALISTA
            where (AVALISTA.deletado = 0 or AVALISTA.deletado is null) and avalista_id = ${avalista_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select 
                AVALISTA.avalista_id,
                AVALISTA.cliente_id,
                AVALISTA.tipo,
                AVALISTA.cpf,
                AVALISTA.cnpj,
                AVALISTA.outroDocumento,
                AVALISTA.nome,
                AVALISTA.nomeFantasia,
                AVALISTA.razaoSocial,
                AVALISTA.cep,
                AVALISTA.ibge_codigo,
                AVALISTA.uf,
                AVALISTA.logradouro,
                AVALISTA.numero,
                AVALISTA.complemento,
                AVALISTA.bairro,
                AVALISTA.telefoneFixo,
                AVALISTA.telefoneCelular,
                AVALISTA.pessoaContato,
                AVALISTA.email,
                AVALISTA.observacao,
                AVALISTA.rg,
                AVALISTA.nacionalidade,
                AVALISTA.estadoCivil_id,
                AVALISTA.expedicao_id,
                AVALISTA.profissao,
                AVALISTA.cnae,
                AVALISTA.cnaeDescricao,
                AVALISTA.capitalSocial,
                AVALISTA.naturezaJuridica,
                AVALISTA.situacao,
                AVALISTA.dataAbertura,
                AVALISTA.dataUltimaAtualizacao,
                AVALISTA.tipoEmpresa,
                AVALISTA.porte,
                AVALISTA.dataSituacao,
                AVALISTA.motivoSituacao,
                AVALISTA.situacaoEspecial,
                AVALISTA.dataSituacaoEspecial,
                AVALISTA.representanteLegal,
                AVALISTA.avalista,
                CONVERT(VARCHAR, AVALISTA.ad_new, 103) + ' ' + CONVERT(VARCHAR, AVALISTA.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, AVALISTA.ad_upd, 103) + ' ' + CONVERT(VARCHAR, AVALISTA.ad_upd, 8) as ad_upd,
                AVALISTA.ad_usr,
                AVALISTA.deletado
            from AVALISTA
            where (AVALISTA.deletado = 0 or AVALISTA.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            tipo,
            cpf,
            cnpj,
            outroDocumento,
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
            pessoaContato,
            email,
            observacao,
            rg,
            nacionalidade,
            estadoCivil_id,
            expedicao_id,
            profissao,
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
            representanteLegal,
            avalista,
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into AVALISTA (
                cliente_id,
                tipo,
                cpf,
                cnpj,
                outroDocumento,
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
                pessoaContato,
                email,
                observacao,
                rg,
                nacionalidade,
                estadoCivil_id,
                expedicao_id,
                profissao,
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
                representanteLegal,
                avalista,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.avalista_id VALUES (
                ${cliente_id},
                '${tipo}',
                '${cpf}',
                '${cnpj}',
                '${outroDocumento}',
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
                '${pessoaContato}',
                '${email}',
                '${observacao}',
                '${rg}',
                '${nacionalidade}',
                ${estadoCivil_id},
                ${expedicao_id},
                '${profissao}',
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
                ${representanteLegal},
                ${avalista},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', avalista_id: result[0].avalista_id }]);
    },

    async update(request, response) {

        const { avalista_id } = request.params;
        const {
            cliente_id,
            tipo,
            cpf,
            cnpj,
            outroDocumento,
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
            pessoaContato,
            email,
            observacao,
            rg,
            nacionalidade,
            estadoCivil_id,
            expedicao_id,
            profissao,
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
            representanteLegal,
            avalista,
            ad_usr,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update AVALISTA set 
                AVALISTA.cliente_id = ${cliente_id},
                AVALISTA.tipo = '${tipo}',
                AVALISTA.cpf = '${cpf}',
                AVALISTA.cnpj = '${cnpj}',
                AVALISTA.outroDocumento = '${outroDocumento}',
                AVALISTA.nome = '${nome}',
                AVALISTA.nomeFantasia = '${nomeFantasia}',
                AVALISTA.razaoSocial = '${razaoSocial}',
                AVALISTA.cep = '${cep}',
                AVALISTA.ibge_codigo = '${ibge_codigo}',
                AVALISTA.uf = '${uf}',
                AVALISTA.logradouro = '${logradouro}',
                AVALISTA.numero = '${numero}',
                AVALISTA.complemento = '${complemento}',
                AVALISTA.bairro = '${bairro}',
                AVALISTA.telefoneFixo = '${telefoneFixo}',
                AVALISTA.telefoneCelular = '${telefoneCelular}',
                AVALISTA.pessoaContato = '${pessoaContato}',
                AVALISTA.email = '${email}',
                AVALISTA.observacao = '${observacao}',
                AVALISTA.rg = '${rg}',
                AVALISTA.nacionalidade = '${nacionalidade}',
                AVALISTA.estadoCivil_id = ${estadoCivil_id},
                AVALISTA.expedicao_id = ${expedicao_id},
                AVALISTA.profissao = '${profissao}',
                AVALISTA.cnae = '${cnae}',
                AVALISTA.cnaeDescricao = '${cnaeDescricao}',
                AVALISTA.capitalSocial = '${capitalSocial}',
                AVALISTA.naturezaJuridica = '${naturezaJuridica}',
                AVALISTA.situacao = '${situacao}',
                AVALISTA.dataAbertura = '${dataAbertura}',
                AVALISTA.dataUltimaAtualizacao = '${dataUltimaAtualizacao}',
                AVALISTA.tipoEmpresa = '${tipoEmpresa}',
                AVALISTA.porte = '${porte}',
                AVALISTA.dataSituacao = '${dataSituacao}',
                AVALISTA.motivoSituacao = '${motivoSituacao}',
                AVALISTA.situacaoEspecial = '${situacaoEspecial}',
                AVALISTA.dataSituacaoEspecial = '${dataSituacaoEspecial}',
                AVALISTA.representanteLegal = ${representanteLegal},
                AVALISTA.avalista = ${avalista},
                AVALISTA.ad_upd = '${ad_upd}',
                AVALISTA.ad_usr = ${ad_usr}
            where avalista_id = ${avalista_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
    
};