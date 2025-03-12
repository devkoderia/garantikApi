const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async busca(request, response) {

        const { cliente_id, descricao } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id as id,
            concat(FAVORECIDO.nome, FAVORECIDO.razaoSocial) + ' - ' + concat(FAVORECIDO.cpf, FAVORECIDO.cnpj) as descricao            
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null) and cliente_id = ${cliente_id} and
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

    async listaTabela(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id as id,
            concat(FAVORECIDO.nome, FAVORECIDO.razaoSocial) as descricao,
            concat(FAVORECIDO.cpf, FAVORECIDO.cnpj) as documento,
            FAVORECIDO.uf,
            FAVORECIDO.ibge_descri,
            CONCAT('', 
                CASE WHEN LEN(FAVORECIDO.telefoneCelular) = 0 THEN FAVORECIDO.telefoneFixo ELSE CONCAT(FAVORECIDO.telefoneFixo,' / ',FAVORECIDO.telefoneCelular) END) as telefone
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async count(request, response) {

        const { cliente_id } = request.body;
        
        const strsql = `select count(*) as total from FAVORECIDO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { favorecido_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update FAVORECIDO set deletado = 1 where favorecido_id = ${favorecido_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaUm(request, response) {

        const { favorecido_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id,
            FAVORECIDO.cliente_id,
            FAVORECIDO.tipo,
            FAVORECIDO.cpf,
            FAVORECIDO.cnpj,
            FAVORECIDO.nome,
            FAVORECIDO.nomeFantasia,
            FAVORECIDO.razaoSocial,
            FAVORECIDO.cep,
            FAVORECIDO.ibge_codigo,
            FAVORECIDO.ibge_descri,
            FAVORECIDO.uf,
            FAVORECIDO.logradouro,
            FAVORECIDO.numero,
            FAVORECIDO.complemento,
            FAVORECIDO.bairro,
            FAVORECIDO.telefoneFixo,
            FAVORECIDO.telefoneCelular,
            FAVORECIDO.email,
            FAVORECIDO.observacao,
            FAVORECIDO.cnae,
            FAVORECIDO.cnaeDescricao,
            FAVORECIDO.capitalSocial,
            FAVORECIDO.naturezaJuridica,
            FAVORECIDO.situacao,
            FAVORECIDO.dataAbertura,
            FAVORECIDO.dataUltimaAtualizacao,
            FAVORECIDO.tipoEmpresa,
            FAVORECIDO.porte,
            FAVORECIDO.dataSituacao,
            FAVORECIDO.motivoSituacao,
            FAVORECIDO.situacaoEspecial,
            FAVORECIDO.dataSituacaoEspecial,
            FAVORECIDO.bloqueado,
            CONVERT(VARCHAR, FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_upd, 8) as ad_upd,
            FAVORECIDO.ad_usr,
            FAVORECIDO.deletado
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null) and favorecido_id = ${favorecido_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id,
            FAVORECIDO.cliente_id,
            FAVORECIDO.tipo,
            FAVORECIDO.cpf,
            FAVORECIDO.cnpj,
            FAVORECIDO.nome,
            FAVORECIDO.nomeFantasia,
            FAVORECIDO.razaoSocial,
            FAVORECIDO.cep,
            FAVORECIDO.ibge_codigo,
            FAVORECIDO.ibge_descri,
            FAVORECIDO.uf,
            FAVORECIDO.logradouro,
            FAVORECIDO.numero,
            FAVORECIDO.complemento,
            FAVORECIDO.bairro,
            FAVORECIDO.telefoneFixo,
            FAVORECIDO.telefoneCelular,
            FAVORECIDO.email,
            FAVORECIDO.observacao,
            FAVORECIDO.cnae,
            FAVORECIDO.cnaeDescricao,
            FAVORECIDO.capitalSocial,
            FAVORECIDO.naturezaJuridica,
            FAVORECIDO.situacao,
            FAVORECIDO.dataAbertura,
            FAVORECIDO.dataUltimaAtualizacao,
            FAVORECIDO.tipoEmpresa,
            FAVORECIDO.porte,
            FAVORECIDO.dataSituacao,
            FAVORECIDO.motivoSituacao,
            FAVORECIDO.situacaoEspecial,
            FAVORECIDO.dataSituacaoEspecial,
            FAVORECIDO.bloqueado,
            CONVERT(VARCHAR, FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_upd, 8) as ad_upd,
            FAVORECIDO.ad_usr,
            FAVORECIDO.deletado
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null)`;

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
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into FAVORECIDO (
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
            '${ibge_descri}',
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

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {
        const { favorecido_id } = request.params;
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
            ad_usr
        } = request.body;
    
        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');
    
        const strsql = `update FAVORECIDO set 
            cliente_id = ${cliente_id},
            tipo = ${tipo},
            cpf = ${cpf},
            cnpj = ${cnpj},
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
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where favorecido_id = ${favorecido_id}`;
    
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};