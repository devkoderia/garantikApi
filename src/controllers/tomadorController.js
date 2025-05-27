const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

async function listaTomador(emissao_id) {
    const strsql = `
        SELECT distinct            
            TOMADOR.tomador_id,
            TOMADOR.nomeFantasia        
        FROM EMISSAO_TOMADOR
        INNER JOIN TOMADOR ON TOMADOR.tomador_id = EMISSAO_TOMADOR.tomador_id
        WHERE (TOMADOR.deletado = 0 OR TOMADOR.deletado IS NULL) 
        AND EMISSAO_TOMADOR.emissao_id = ${emissao_id}`;

    const resultado = await executeQuery(strsql);
    return resultado;
}

module.exports = {
    
    async find(request, response) {

        var { tomador, cliente_id } = request.body

        var strsql = `
        
        select 
        top 5
        tomador_id, 
        cpf,
        cnpj,
        nome,
        tipoJuridico,
        nomeFantasia
        from TOMADOR
        where cliente_id = ${cliente_id}
        and 
        (TOMADOR.cpf like ${`'%${tomador}%'`} or TOMADOR.cnpj like ${`'%${tomador}%'`} or TOMADOR.nome like ${`'%${tomador}%'`} or TOMADOR.nomeFantasia like ${`'%${tomador}%'`})
        and (deletado = 0 or deletado is null)
                
        `

        var resultado = await executeQuery(strsql)
        response.status(200).send(resultado)


    },


    async verificaDuplicidade(request, response) {
        const { cliente_id, documento } = request.body;

        const strsql = `select tomador_id from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is NULL) and 
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
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is NULL) and cliente_id = ${cliente_id} and
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
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is NULL) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from TOMADOR where (deletado = 0 or deletado is NULL) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { tomador_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update TOMADOR set deletado = 1 where tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { tomador_id } = request.params;
        const { cliente_id } = request.body;

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
            TOMADOR.pessoaContato,
            TOMADOR.emailPessoaContato,
            TOMADOR.telefoneFixoPessoaContato,
            TOMADOR.telefoneCelularPessoaContato,
            TOMADOR.profissao,
            TOMADOR.nacionalidade_id,
            TOMADOR.observacao,
            TOMADOR.cnae,
            TOMADOR.cnaeDescricao,
            TOMADOR.capitalSocial,
            TOMADOR.naturezaJuridica,
            TOMADOR.situacao,
            CONVERT(VARCHAR, TOMADOR.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, TOMADOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            TOMADOR.tipoEmpresa,
            TOMADOR.porte,
            CONVERT(VARCHAR, TOMADOR.dataSituacao, 103) as dataSituacao,
            TOMADOR.motivoSituacao,
            TOMADOR.situacaoEspecial,
            CONVERT(VARCHAR, TOMADOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
            TOMADOR.limiteGeral,
            TOMADOR.limiteTomado,
            TOMADOR.limiteTradicional,
            TOMADOR.taxaTradicional,
            TOMADOR.limiteRecursal,
            TOMADOR.taxaRecursal,
            TOMADOR.limiteFinanceira,
            TOMADOR.taxaFinanceira,
            TOMADOR.limiteJudicial,
            TOMADOR.taxaJudicial,
            TOMADOR.limiteEstruturada,
            TOMADOR.taxaEstruturada,
            TOMADOR.aprovado,
            TOMADOR.estadoCivil,
            TOMADOR.restricao,
            TOMADOR.bloqueado,
            TOMADOR.outroDocumento,
            TOMADOR.outroDocumentoDescricao,
            CONVERT(VARCHAR, TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_upd, 8) as ad_upd,
            TOMADOR.ad_usr,
            TOMADOR.deletado
            from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is NULL) and tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

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
            TOMADOR.pessoaContato,
            TOMADOR.emailPessoaContato,
            TOMADOR.telefoneFixoPessoaContato,
            TOMADOR.telefoneCelularPessoaContato,
            TOMADOR.profissao,
            TOMADOR.nacionalidade_id,
            TOMADOR.observacao,
            TOMADOR.cnae,
            TOMADOR.cnaeDescricao,
            TOMADOR.capitalSocial,
            TOMADOR.naturezaJuridica,
            TOMADOR.situacao,
            CONVERT(VARCHAR, TOMADOR.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, TOMADOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            TOMADOR.tipoEmpresa,
            TOMADOR.porte,
            CONVERT(VARCHAR, TOMADOR.dataSituacao, 103) as dataSituacao,
            TOMADOR.motivoSituacao,
            TOMADOR.situacaoEspecial,
            CONVERT(VARCHAR, TOMADOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
            TOMADOR.limiteGeral,
            TOMADOR.limiteTomado,
            TOMADOR.limiteTradicional,
            TOMADOR.taxaTradicional,
            TOMADOR.limiteRecursal,
            TOMADOR.taxaRecursal,
            TOMADOR.limiteFinanceira,
            TOMADOR.taxaFinanceira,
            TOMADOR.limiteJudicial,
            TOMADOR.taxaJudicial,
            TOMADOR.limiteEstruturada,
            TOMADOR.taxaEstruturada,
            TOMADOR.aprovado,
            TOMADOR.estadoCivil,
            TOMADOR.restricao,
            TOMADOR.bloqueado,
            TOMADOR.outroDocumento,
            TOMADOR.outroDocumentoDescricao,
            CONVERT(VARCHAR, TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, TOMADOR.ad_upd, 8) as ad_upd,
            TOMADOR.ad_usr,
            TOMADOR.deletado
            from TOMADOR
            where (TOMADOR.deletado = 0 or TOMADOR.deletado is NULL) and cliente_id = ${cliente_id}`;

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
            restricao,
            limiteGeral,
            limiteTomado,
            limiteTradicional,
            taxaTradicional,
            limiteRecursal,
            taxaRecursal,
            limiteFinanceira,
            taxaFinanceira,
            limiteJudicial,
            taxaJudicial,
            limiteEstruturada,
            taxaEstruturada,
            aprovado,
            outroDocumento,
            outroDocumentoDescricao,
            ad_usr,
            nacionalidade_id,
            profissao,
            estadoCivil,
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const bloqueado = 0

        const strsql = `insert into TOMADOR (
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
            restricao,
            limiteGeral,
            limiteTomado,
            limiteTradicional,
            taxaTradicional,
            limiteRecursal,
            taxaRecursal,
            limiteFinanceira,
            taxaFinanceira,
            limiteJudicial,
            taxaJudicial,
            limiteEstruturada,
            taxaEstruturada,
            aprovado,
            outroDocumento,
            outroDocumentoDescricao,
            ad_new,
            ad_upd,
            ad_usr,
            deletado,
            nacionalidade_id,
            profissao,
            estadoCivil,
            bloqueado
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
            ${situacao != '' && situacao != null ? `'${situacao}'` : 'NULL'},
            ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
            ${tipoEmpresa != '' && tipoEmpresa != null ? `'${tipoEmpresa}'` : 'NULL'},
            ${porte != '' && porte != null ? `'${porte}'` : 'NULL'},
            ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${motivoSituacao != '' && motivoSituacao != null ? `'${motivoSituacao}'` : 'NULL'},
            ${situacaoEspecial != '' && situacaoEspecial != null ? `'${situacaoEspecial}'` : 'NULL'},
            ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
            ${restricao == true ? 1 : restricao == false ? 0 : 'NULL'}
            ${limiteGeral},
            ${limiteTomado},
            ${limiteTradicional},
            ${taxaTradicional},
            ${limiteRecursal},
            ${taxaRecursal},
            ${limiteFinanceira},
            ${taxaFinanceira},
            ${limiteJudicial},
            ${taxaJudicial},
            ${limiteEstruturada},
            ${taxaEstruturada},
            ${aprovado == true ? 1 : aprovado == false ? 0 : 'NULL'},
            ${outroDocumento != '' && outroDocumento != null ? `'${outroDocumento}'` : 'NULL'},
            ${outroDocumentoDescricao != '' && outroDocumentoDescricao != null ? `'${outroDocumentoDescricao}'` : 'NULL'},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr ? ad_usr : 'NULL'},
            0,
            ${typeof nacionalidade_id == 'number' ? nacionalidade_id : 'NULL'},
            ${profissao != '' && profissao != null ? `'${profissao}'` : 'NULL'},
            ${estadoCivil != '' && estadoCivil != null ? `'${estadoCivil}'` : 'NULL'},
            ${bloqueado == true ? 1 : bloqueado == false ? 0 : 'NULL'}
        )`;

        console.log(strsql)
        //return false

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async update(request, response) {

        const { tomador_id } = request.params;

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
            restricao,
            limiteGeral,
            limiteTomado,
            limiteTradicional,
            taxaTradicional,
            limiteRecursal,
            taxaRecursal,
            limiteFinanceira,
            taxaFinanceira,
            limiteJudicial,
            taxaJudicial,
            limiteEstruturada,
            taxaEstruturada,
            ad_usr,
            aprovado,
            estadoCivil,
            nacionalidade_id,
            profissao,
            outroDocumento,
            outroDocumentoDescricao,
            bloqueado
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update TOMADOR set             
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
            telefoneFixoPessoaContato = ${telefoneFixoPessoaContato != '' && telefoneFixoPessoaContato != null ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
            telefoneCelularPessoaContato = ${telefoneCelularPessoaContato != '' && telefoneCelularPessoaContato != null ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
            restricao = ${restricao == true ? 1 : restricao == false ? 0 : 'NULL'},
            limiteGeral = ${limiteGeral},
            limiteTomado = ${limiteTomado},
            limiteTradicional = ${limiteTradicional},
            taxaTradicional = ${taxaTradicional},
            limiteRecursal = ${limiteRecursal},
            taxaRecursal = ${taxaRecursal},
            limiteFinanceira = ${limiteFinanceira},
            taxaFinanceira = ${taxaFinanceira},
            limiteJudicial = ${limiteJudicial},
            taxaJudicial = ${taxaJudicial},
            limiteEstruturada = ${limiteEstruturada},
            taxaEstruturada = ${taxaEstruturada},
            bloqueado = ${bloqueado == true ? 1 : bloqueado == false ? 0 : 'NULL'},
            aprovado = ${aprovado == true ? 1 : aprovado == false ? 0 : 'NULL'},
            nacionalidade_id = ${typeof nacionalidade_id == 'number' ? nacionalidade_id : 'NULL'},
            profissao = ${profissao != '' && profissao != null ? `'${profissao}'` : 'NULL'},
            outroDocumento = ${outroDocumento != '' && outroDocumento != null ? `'${outroDocumento}'` : 'NULL'},
            outroDocumentoDescricao = ${outroDocumentoDescricao != '' && outroDocumentoDescricao != null ? `'${outroDocumentoDescricao}'` : 'NULL'},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where tomador_id = ${tomador_id} and cliente_id = ${cliente_id}`;

        console.log(strsql);

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    listaTomador
};