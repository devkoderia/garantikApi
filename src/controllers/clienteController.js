const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async count(request, response) {

        const strsql = `select count(*) as total from CLIENTE where (deletado = 0 or deletado is null)`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { cliente_id } = request.params;

        const strsql = `update CLIENTE set deletado = 1 where cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { cliente_id } = request.params;

        const strsql = `select 
                CLIENTE.cliente_id,
                CLIENTE.cnpj,
                CLIENTE.nomeFantasia,
                CLIENTE.razaoSocial,
                CLIENTE.cep,
                CLIENTE.ibge_codigo,
                CLIENTE.uf,
                CLIENTE.logradouro,
                CLIENTE.numero,
                CLIENTE.complemento,
                CLIENTE.bairro,
                CLIENTE.telefoneFixo,
                CLIENTE.telefoneCelular,
                CLIENTE.email,
                CLIENTE.observacao,
                CLIENTE.cnae,
                CLIENTE.cnaeDescricao,
                CLIENTE.capitalSocial,
                CLIENTE.naturezaJuridica,
                CLIENTE.situacao,
                CLIENTE.dataAbertura,
                CLIENTE.dataUltimaAtualizacao,
                CLIENTE.tipoEmpresa,
                CLIENTE.porte,
                CLIENTE.dataSituacao,
                CLIENTE.motivoSituacao,
                CLIENTE.situacaoEspecial,
                CLIENTE.dataSituacaoEspecial,
                CLIENTE.bloqueado,
                CONVERT(VARCHAR, CLIENTE.ad_new, 103) + ' ' + CONVERT(VARCHAR, CLIENTE.ad_new, 8) as ad_new,
                CONVERT(VARCHAR, CLIENTE.ad_upd, 103) + ' ' + CONVERT(VARCHAR, CLIENTE.ad_upd, 8) as ad_upd,
                CLIENTE.ad_usr,
                CLIENTE.deletado
            from CLIENTE
            where (CLIENTE.deletado = 0 or CLIENTE.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {
        const strsql = `select 
                CLIENTE.cliente_id,
                CLIENTE.cnpj,
                CLIENTE.nomeFantasia,
                CLIENTE.razaoSocial,                
                CLIENTE.bloqueado,
                CONVERT(VARCHAR, CLIENTE.ad_new, 103) + ' ' + CONVERT(VARCHAR, CLIENTE.ad_new, 8) as ad_new
                
            from CLIENTE
            where (CLIENTE.deletado = 0 or CLIENTE.deletado is null)
            order by CLIENTE.nomeFantasia`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },


    async listaLogin(request, response) {

        const { usuario_id } = request.params

        const strsql = `select 
                C.cliente_id,
                C.cnpj,
                C.nomeFantasia,
                C.razaoSocial
            from CLIENTE_USUARIO CU
            inner join CLIENTE C on CU.cliente_id = C.cliente_id
            inner join USUARIO U on CU.usuario_id = U.usuario_id
            where (C.deletado = 0 or C.deletado is null) and CU.usuario_id = ${usuario_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cnpj,
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
            ad_usr,
        } = request.body;

        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into CLIENTE (
                cnpj,
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
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) OUTPUT INSERTED.cliente_id VALUES (
                '${cnpj}',
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
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', cliente_id: result[0].cliente_id }]);
    },

    async update(request, response) {

        const { cliente_id } = request.params;
        
        const {
            cnpj,
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
            ad_usr,
            bloqueado
        } = request.body;

        if (!bloqueado) {
            bloqueado = 0;
        }

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update CLIENTE set 
                CLIENTE.cnpj = '${cnpj}',
                CLIENTE.nomeFantasia = '${nomeFantasia}',
                CLIENTE.razaoSocial = '${razaoSocial}',
                CLIENTE.cep = '${cep}',
                CLIENTE.ibge_codigo = '${ibge_codigo}',
                CLIENTE.uf = '${uf}',
                CLIENTE.logradouro = '${logradouro}',
                CLIENTE.numero = '${numero}',
                CLIENTE.complemento = '${complemento}',
                CLIENTE.bairro = '${bairro}',
                CLIENTE.telefoneFixo = '${telefoneFixo}',
                CLIENTE.telefoneCelular = '${telefoneCelular}',
                CLIENTE.email = '${email}',
                CLIENTE.observacao = '${observacao}',
                CLIENTE.cnae = '${cnae}',
                CLIENTE.cnaeDescricao = '${cnaeDescricao}',
                CLIENTE.capitalSocial = '${capitalSocial}',
                CLIENTE.naturezaJuridica = '${naturezaJuridica}',
                CLIENTE.situacao = '${situacao}',
                CLIENTE.dataAbertura = '${dataAbertura}',
                CLIENTE.dataUltimaAtualizacao = '${dataUltimaAtualizacao}',
                CLIENTE.tipoEmpresa = '${tipoEmpresa}',
                CLIENTE.porte = '${porte}',
                CLIENTE.dataSituacao = '${dataSituacao}',
                CLIENTE.motivoSituacao = '${motivoSituacao}',
                CLIENTE.situacaoEspecial = '${situacaoEspecial}',
                CLIENTE.dataSituacaoEspecial = '${dataSituacaoEspecial}',
                CLIENTE.bloqueado = ${bloqueado},
                CLIENTE.ad_upd = '${ad_upd}',
                CLIENTE.ad_usr = ${ad_usr}
            where cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },
};