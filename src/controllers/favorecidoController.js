const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

async function listaFavorecido(emissao_id) {

    const strsql = `select 
        FAVORECIDO.favorecido_id,
        FAVORECIDO.nomeFantasia        
        from EMISSAO_FAVORECIDO
        INNER JOIN FAVORECIDO ON FAVORECIDO.favorecido_id = EMISSAO_FAVORECIDO.favorecido_id
        where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is NULL) and emissao_id = ${emissao_id}`;

    const resultado = await executeQuery(strsql);
    return resultado;
}

module.exports = {

    async busca(request, response) {

        const { cliente_id, descricao } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id,
            FAVORECIDO.nome, 
            FAVORECIDO.nomeFantasia,
            FAVORECIDO.cnpj,
            FAVORECIDO.cpf,
            FAVORECIDO.tipoJuridico
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null) and cliente_id = ${cliente_id} and
            (
                nome like '%${descricao}%' or 
                razaoSocial like '%${descricao}%' or
                nomeFantasia like '%${descricao}%' or
                cpf like '%${descricao}%' or
                cnpj like '%${descricao}%'
            )`;

        //console.log(strsql)
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
        response.status(200).json({ status: 'ok' });

    },

    async listaUm(request, response) {

        const { favorecido_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            FAVORECIDO.favorecido_id,
            FAVORECIDO.cliente_id,
            FAVORECIDO.tipoJuridico,
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
            FAVORECIDO.pessoaContato,
            FAVORECIDO.emailPessoaContato,
            FAVORECIDO.telefoneFixoPessoaContato,
            FAVORECIDO.telefoneCelularPessoaContato,
            FAVORECIDO.observacao,
            FAVORECIDO.profissao,
            FAVORECIDO.nacionalidade_id,
            FAVORECIDO.cnae,
            FAVORECIDO.cnaeDescricao,
            FAVORECIDO.capitalSocial,
            FAVORECIDO.naturezaJuridica,
            FAVORECIDO.situacao,
            FAVORECIDO.outroDocumento,
            FAVORECIDO.outroDocumentoDescricao,
            CONVERT(VARCHAR, FAVORECIDO.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, FAVORECIDO.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            FAVORECIDO.tipoEmpresa,
            FAVORECIDO.porte,
            CONVERT(VARCHAR, FAVORECIDO.dataSituacao, 103) as dataSituacao,
            FAVORECIDO.motivoSituacao,
            FAVORECIDO.situacaoEspecial,
            CONVERT(VARCHAR, FAVORECIDO.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
            FAVORECIDO.bloqueado,
            FAVORECIDO.estadoCivil,
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
            FAVORECIDO.tipoJuridico,
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
            FAVORECIDO.pessoaContato,
            FAVORECIDO.emailPessoaContato,
            FAVORECIDO.telefoneFixoPessoaContato,
            FAVORECIDO.telefoneCelularPessoaContato,
            FAVORECIDO.observacao,
            FAVORECIDO.profissao,
            FAVORECIDO.nacionalidade_id,
            FAVORECIDO.cnae,
            FAVORECIDO.cnaeDescricao,
            FAVORECIDO.capitalSocial,
            FAVORECIDO.naturezaJuridica,
            FAVORECIDO.situacao,
            FAVORECIDO.outroDocumento,
            FAVORECIDO.outroDocumentoDescricao,
            CONVERT(VARCHAR, FAVORECIDO.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, FAVORECIDO.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            FAVORECIDO.tipoEmpresa,
            FAVORECIDO.porte,
            CONVERT(VARCHAR, FAVORECIDO.dataSituacao, 103) as dataSituacao,
            FAVORECIDO.motivoSituacao,
            FAVORECIDO.situacaoEspecial,
            CONVERT(VARCHAR, FAVORECIDO.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
            FAVORECIDO.bloqueado,
            FAVORECIDO.estadoCivil,
            CONVERT(VARCHAR, FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, FAVORECIDO.ad_upd, 8) as ad_upd,
            FAVORECIDO.ad_usr,
            FAVORECIDO.deletado
            from FAVORECIDO
            where (FAVORECIDO.deletado = 0 or FAVORECIDO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
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
            pessoaContato,
            emailPessoaContato,
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
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
            estadoCivil,
            profissao,
            nacionalidade_id,
            outroDocumento,
            outroDocumentoDescricao,
            bloqueado,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into FAVORECIDO (
            cliente_id,
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
            pessoaContato,
            emailPessoaContato,
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
            observacao,
            cnae,
            cnaeDescricao,
            capitalSocial,
            naturezaJuridica,
            estadoCivil,
            situacao,
            dataAbertura,
            dataUltimaAtualizacao,
            tipoEmpresa,
            porte,
            dataSituacao,
            motivoSituacao,
            situacaoEspecial,
            dataSituacaoEspecial,
            profissao,
            nacionalidade_id,
            bloqueado,
            outroDocumento,
            outroDocumentoDescricao,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
            ${cpf ? `'${cpf}'` : 'NULL'},
            ${cnpj ? `'${cnpj}'` : 'NULL'},
            ${nome != '' && nome != null ? `'${nome}'` : 'NULL'},
            ${nomeFantasia != '' && nomeFantasia != null ? `'${nomeFantasia}'` : 'NULL'},
            ${razaoSocial != '' && razaoSocial != null ? `'${razaoSocial}'` : 'NULL'},
            ${cep ? `'${cep}'` : 'NULL'},
            ${ibge_codigo ? `'${ibge_codigo}'` : 'NULL'},
            ${ibge_descri != '' && ibge_descri != null ? `'${ibge_descri}'` : 'NULL'},
            ${uf ? `'${uf}'` : 'NULL'},
            ${logradouro != '' && logradouro != null ? `'${logradouro}'` : 'NULL'},
            ${numero != '' && numero != null ? `'${numero}'` : 'NULL'},
            ${complemento != '' && complemento != null ? `'${complemento}'` : 'NULL'},
            ${bairro != '' && bairro != null ? `'${bairro}'` : 'NULL'},
            ${telefoneFixo != '' && telefoneFixo != null ? `'${telefoneFixo}'` : 'NULL'},
            ${telefoneCelular != '' && telefoneCelular != null ? `'${telefoneCelular}'` : 'NULL'},
            ${email != '' && email != null ? `'${email}'` : 'NULL'},
            ${pessoaContato != '' && pessoaContato != null ? `'${pessoaContato}'` : 'NULL'},
            ${emailPessoaContato != '' && emailPessoaContato != null ? `'${emailPessoaContato}'` : 'NULL'},
            ${telefoneFixoPessoaContato != '' && telefoneFixoPessoaContato != null ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
            ${telefoneCelularPessoaContato != '' && telefoneCelularPessoaContato != null ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
            ${observacao != '' && observacao != null ? `'${observacao}'` : 'NULL'},
            ${cnae != '' && cnae != null ? `'${cnae}'` : 'NULL'},
            ${cnaeDescricao != '' && cnaeDescricao != null ? `'${cnaeDescricao}'` : 'NULL'},
            ${capitalSocial ? capitalSocial.toString().replaceAll('.', '').replaceAll(',', '.') : null},
            ${naturezaJuridica != '' && naturezaJuridica != null ? `'${naturezaJuridica}'` : 'NULL'},
            ${estadoCivil != '' && estadoCivil != null ? `'${estadoCivil}'` : 'NULL'},
            ${situacao != '' && situacao != null ? `'${situacao}'` : 'NULL'},
            ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
            ${tipoEmpresa != '' && tipoEmpresa != null ? `'${tipoEmpresa}'` : 'NULL'},
            ${porte != '' && porte != null ? `'${porte}'` : 'NULL'},
            ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${motivoSituacao != '' && motivoSituacao != null ? `'${motivoSituacao}'` : 'NULL'},
            ${situacaoEspecial != '' && situacaoEspecial != null ? `'${situacaoEspecial}'` : 'NULL'},
            ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${profissao != '' && profissao != null ? `'${profissao}'` : 'NULL'},
            ${typeof nacionalidade_id == 'number' ? nacionalidade_id : 'NULL'},
            ${bloqueado == true ? 1 : bloqueado == false ? 0 : 'NULL'},
            ${outroDocumento != '' && outroDocumento != null ? `'${outroDocumento}'` : 'NULL'},
            ${outroDocumentoDescricao != '' && outroDocumentoDescricao != null ? `'${outroDocumentoDescricao}'` : 'NULL'},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        console.log(strsql);

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async update(request, response) {

        const { favorecido_id } = request.params;

        const {
            cliente_id,
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
            pessoaContato,
            emailPessoaContato,
            telefoneFixoPessoaContato,
            telefoneCelularPessoaContato,
            estadoCivil,
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
            profissao,
            nacionalidade_id,
            bloqueado,
            outroDocumento,
            outroDocumentoDescricao,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update FAVORECIDO set 
            cliente_id = ${cliente_id},
            tipoJuridico = ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
            cpf = ${cpf ? `'${cpf}'` : 'NULL'},
            cnpj = ${cnpj ? `'${cnpj}'` : 'NULL'},
            nome = ${nome != '' && nome != null ? `'${nome}'` : 'NULL'},
            nomeFantasia = ${nomeFantasia != '' && nomeFantasia != null ? `'${nomeFantasia}'` : 'NULL'},
            razaoSocial = ${razaoSocial != '' && razaoSocial != null ? `'${razaoSocial}'` : 'NULL'},
            cep = ${cep ? `'${cep}'` : 'NULL'},
            ibge_codigo = ${ibge_codigo ? `'${ibge_codigo}'` : 'NULL'},
            ibge_descri = ${ibge_descri != '' && ibge_descri != null ? `'${ibge_descri}'` : 'NULL'},
            uf = ${uf ? `'${uf}'` : 'NULL'},
            logradouro = ${logradouro != '' && logradouro != null ? `'${logradouro}'` : 'NULL'},
            numero = ${numero != '' && numero != null ? `'${numero}'` : 'NULL'},
            complemento = ${complemento != '' && complemento != null ? `'${complemento}'` : 'NULL'},
            bairro = ${bairro != '' && bairro != null ? `'${bairro}'` : 'NULL'},
            telefoneFixo = ${telefoneFixo != '' && telefoneFixo != null ? `'${telefoneFixo}'` : 'NULL'},
            telefoneCelular = ${telefoneCelular != '' && telefoneCelular != null ? `'${telefoneCelular}'` : 'NULL'},
            email = ${email != '' && email != null ? `'${email}'` : 'NULL'},
            pessoaContato = ${pessoaContato != '' && pessoaContato != null ? `'${pessoaContato}'` : 'NULL'},
            emailPessoaContato = ${emailPessoaContato != '' && emailPessoaContato != null ? `'${emailPessoaContato}'` : 'NULL'},
            telefoneFixoPessoaContato = ${telefoneFixoPessoaContato != '' && telefoneFixoPessoaContato != null ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
            telefoneCelularPessoaContato = ${telefoneCelularPessoaContato != '' && telefoneCelularPessoaContato != null ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
            observacao = ${observacao != '' && observacao != null ? `'${observacao}'` : 'NULL'},
            cnae = ${cnae != '' && cnae != null ? `'${cnae}'` : 'NULL'},
            cnaeDescricao = ${cnaeDescricao != '' && cnaeDescricao != null ? `'${cnaeDescricao}'` : 'NULL'},
            capitalSocial = ${capitalSocial ? capitalSocial.toString().replaceAll('.', '').replaceAll(',', '.') : null},
            naturezaJuridica = ${naturezaJuridica != '' && naturezaJuridica != null ? `'${naturezaJuridica}'` : 'NULL'},
            estadoCivil = ${estadoCivil != '' && estadoCivil != null ? `'${estadoCivil}'` : 'NULL'},
            situacao = ${situacao != '' && situacao != null ? `'${situacao}'` : 'NULL'},
            dataAbertura = ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            dataUltimaAtualizacao = ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
            tipoEmpresa = ${tipoEmpresa != '' && tipoEmpresa != null ? `'${tipoEmpresa}'` : 'NULL'},
            porte = ${porte != '' && porte != null ? `'${porte}'` : 'NULL'},
            dataSituacao = ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            motivoSituacao = ${motivoSituacao != '' && motivoSituacao != null ? `'${motivoSituacao}'` : 'NULL'},
            situacaoEspecial = ${situacaoEspecial != '' && situacaoEspecial != null ? `'${situacaoEspecial}'` : 'NULL'},
            dataSituacaoEspecial = ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            profissao = ${profissao != '' && profissao != null ? `'${profissao}'` : 'NULL'},
            nacionalidade_id = ${typeof nacionalidade_id == 'number' ? nacionalidade_id : 'NULL'},
            bloqueado = ${bloqueado == true ? 1 : bloqueado == false ? 0 : 'NULL'},
            outroDocumento = ${outroDocumento != '' && outroDocumento != null ? `'${outroDocumento}'` : 'NULL'},
            outroDocumentoDescricao = ${outroDocumentoDescricao != '' && outroDocumentoDescricao != null ? `'${outroDocumentoDescricao}'` : 'NULL'},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where favorecido_id = ${favorecido_id}`;

            console.log(strsql);

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    listaFavorecido
};