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
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { produtor_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            PRODUTOR.produtor_id,
            PRODUTOR.cliente_id,
            PRODUTOR.tipoJuridico,
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
            PRODUTOR.nacionalidade_id,
            PRODUTOR.estadoCivil,
            PRODUTOR.profissao,
            PRODUTOR.banco_id,
            PRODUTOR.agencia,
            PRODUTOR.numeroConta,
            PRODUTOR.tipoConta,
            PRODUTOR.chavePix,
            PRODUTOR.nomeCorrentista,
            PRODUTOR.cpfCorrentista,
            PRODUTOR.cnpjCorrentista,
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
            CONVERT(VARCHAR, PRODUTOR.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, PRODUTOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            PRODUTOR.tipoEmpresa,
            PRODUTOR.porte,
            CONVERT(VARCHAR, PRODUTOR.dataSituacao, 103) as dataSituacao,
            PRODUTOR.motivoSituacao,
            PRODUTOR.situacaoEspecial,
            CONVERT(VARCHAR, PRODUTOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
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
            PRODUTOR.tipoJuridico,
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
            PRODUTOR.nacionalidade_id,
            PRODUTOR.estadoCivil,
            PRODUTOR.profissao,

            PRODUTOR.banco_id,
            PRODUTOR.agencia,
            PRODUTOR.numeroConta,
            PRODUTOR.tipoConta,
            PRODUTOR.chavePix,
            PRODUTOR.nomeCorrentista,
            PRODUTOR.cpfCorrentista,
            PRODUTOR.cnpjCorrentista,

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
            CONVERT(VARCHAR, PRODUTOR.dataAbertura, 103) as dataAbertura,
            CONVERT(VARCHAR, PRODUTOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, PRODUTOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
            PRODUTOR.tipoEmpresa,
            PRODUTOR.porte,
            CONVERT(VARCHAR, PRODUTOR.dataSituacao, 103) as dataSituacao,
            PRODUTOR.motivoSituacao,
            PRODUTOR.situacaoEspecial,
            CONVERT(VARCHAR, PRODUTOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
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


    async listaSelect(request, response) {

        const { cliente_id } = request.body;

        const strsql = `SELECT 
                    PRODUTOR.produtor_id,
                    CASE 
                        WHEN PRODUTOR.tipoJuridico = 'F' THEN PRODUTOR.nome + ' - ' + PRODUTOR.cpf
                        WHEN PRODUTOR.tipoJuridico = 'J' THEN PRODUTOR.nomeFantasia + ' - ' + PRODUTOR.cnpj
                        ELSE NULL
                    END AS nomeConcatenado
                FROM PRODUTOR
                WHERE (PRODUTOR.deletado = 0 OR PRODUTOR.deletado IS NULL)
                AND cliente_id = ${cliente_id}
                ORDER BY 
                    CASE 
                        WHEN PRODUTOR.tipoJuridico = 'F' THEN PRODUTOR.nome
                        WHEN PRODUTOR.tipoJuridico = 'J' THEN PRODUTOR.nomeFantasia
                        ELSE ''
                    END;
                `;

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
            nacionalidade_id,
            estadoCivil,
            profissao,
            banco_id,
            agencia,
            numeroConta,
            tipoConta,
            chavePix,
            nomeCorrentista,
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
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:mm:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `INSERT INTO PRODUTOR (
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
                        nacionalidade_id,
                        estadoCivil,
                        profissao,
                        banco_id,
                        agencia,
                        numeroConta,
                        tipoConta,
                        chavePix,
                        nomeCorrentista
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
                    ) VALUES (
                        ${cliente_id},
                        ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
                        ${cpf ? `'${cpf}'` : null},
                        ${cnpj ? `'${cnpj}'` : null},
                        ${nome ? `'${nome.toUpperCase()}'` : 'NULL'},
                        ${nomeFantasia ? `'${nomeFantasia.toUpperCase()}'` : 'NULL'},
                        ${razaoSocial ? `'${razaoSocial.toUpperCase()}'` : 'NULL'},
                        ${cep ? `'${cep}'` : 'NULL'},
                        ${ibge_codigo ? `'${ibge_codigo}'` : 'NULL'},
                        ${ibge_descri ? `'${ibge_descri}'` : 'NULL'},
                        ${uf ? `'${uf}'` : 'NULL'},
                        ${logradouro ? `'${logradouro}'` : 'NULL'},
                        ${numero ? `'${numero}'` : 'NULL'},
                        ${complemento ? `'${complemento}'` : 'NULL'},
                        ${bairro ? `'${bairro}'` : 'NULL'},
                        ${telefoneFixo ? `'${telefoneFixo}'` : 'NULL'},
                        ${telefoneCelular ? `'${telefoneCelular}'` : 'NULL'},
                        ${email ? `'${email}'` : 'NULL'},
                        ${nacionalidade_id ? nacionalidade_id : 'NULL'},
                        ${estadoCivil ? `'${estadoCivil}'` : 'NULL'},
                        ${profissao ? `'${profissao}'` : 'NULL'},
                        ${banco_id ? banco_id : 'NULL'},
                        ${agencia ? `'${agencia}'` : 'NULL'},
                        ${numeroConta ? `'${numeroConta}'` : 'NULL'},
                        ${tipoConta ? `'${tipoConta}'` : 'NULL'},
                        ${chavePix ? `'${chavePix}'` : 'NULL'},
                        ${nomeCorrentista ? `'${nomeCorrentista}'` : 'NULL'},
                        ${cpfCorrentista ? `'${cpfCorrentista}'` : 'NULL'},
                        ${cnpjCorrentista ? `'${cnpjCorrentista}'` : 'NULL'},
                        ${pessoaContato ? `'${pessoaContato}'` : 'NULL'},
                        ${emailPessoaContato ? `'${emailPessoaContato}'` : 'NULL'},
                        ${telefoneFixoPessoaContato ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
                        ${telefoneCelularPessoaContato ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
                        ${observacao ? `'${observacao}'` : 'NULL'},
                        ${comissaoPorcentagem ? comissaoPorcentagem.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                        ${premioMinimo ? premioMinimo.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                        ${cnae ? `'${cnae}'` : 'NULL'},
                        ${cnaeDescricao ? `'${cnaeDescricao}'` : 'NULL'},
                        ${capitalSocial ? `'${capitalSocial}'` : 'NULL'},
                        ${naturezaJuridica ? `'${naturezaJuridica}'` : 'NULL'},
                        ${situacao ? `'${situacao}'` : 'NULL'},
                        ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
                        ${tipoEmpresa ? `'${tipoEmpresa}'` : 'NULL'},
                        ${porte ? `'${porte}'` : 'NULL'},
                        ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        ${motivoSituacao ? `'${motivoSituacao}'` : 'NULL'},
                        ${situacaoEspecial ? `'${situacaoEspecial}'` : 'NULL'},
                        ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        ${susep ? `'${susep}'` : 'NULL'},
                        '${ad_new}',
                        '${ad_upd}',
                        ${ad_usr ? ad_usr : 'NULL'},
                        0,
                        0
                    )`;

        console.log(strsql);
        //return false

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    },

    async update(request, response) {

        const { produtor_id } = request.params;

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
            nacionalidade_id,
            estadoCivil,
            profissao,
            banco_id,
            agencia,
            numeroConta,
            tipoConta,
            chavePix,
            nomeCorrentista,
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

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update PRODUTOR set 
                        PRODUTOR.cliente_id = ${cliente_id},
                        PRODUTOR.tipoJuridico = ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
                        PRODUTOR.cpf = ${cpf ? `'${cpf}'` : 'null'},
                        PRODUTOR.cnpj = ${cnpj ? `'${cnpj}'` : 'null'},
                        PRODUTOR.nome = ${nome ? `'${nome.toUpperCase()}'` : 'NULL'},
                        PRODUTOR.nomeFantasia = ${nomeFantasia ? `'${nomeFantasia.toUpperCase()}'` : 'NULL'},
                        PRODUTOR.razaoSocial = ${razaoSocial ? `'${razaoSocial.toUpperCase()}'` : 'NULL'},
                        PRODUTOR.cep = ${cep ? `'${cep}'` : 'NULL'},
                        PRODUTOR.ibge_codigo = ${ibge_codigo ? `'${ibge_codigo}'` : 'NULL'},
                        PRODUTOR.ibge_descri = ${ibge_descri ? `'${ibge_descri}'` : 'NULL'},
                        PRODUTOR.uf = ${uf ? `'${uf}'` : 'NULL'},
                        PRODUTOR.logradouro = ${logradouro ? `'${logradouro}'` : 'NULL'},
                        PRODUTOR.numero = ${numero ? `'${numero}'` : 'NULL'},
                        PRODUTOR.complemento = ${complemento ? `'${complemento}'` : 'NULL'},
                        PRODUTOR.bairro = ${bairro ? `'${bairro}'` : 'NULL'},
                        PRODUTOR.telefoneFixo = ${telefoneFixo ? `'${telefoneFixo}'` : 'NULL'},
                        PRODUTOR.telefoneCelular = ${telefoneCelular ? `'${telefoneCelular}'` : 'NULL'},
                        PRODUTOR.email = ${email ? `'${email}'` : 'NULL'},
                        PRODUTOR.nacionalidade_id = ${nacionalidade_id ? nacionalidade_id : 'NULL'},
                        PRODUTOR.estadoCivil = ${estadoCivil ? `'${estadoCivil}'` : 'NULL'},
                        PRODUTOR.profissao = ${profissao ? `'${profissao}'` : 'NULL'},
                        PRODUTOR.banco_id = ${banco_id ? banco_id : 'NULL'},
                        PRODUTOR.agencia = ${agencia ? `'${agencia}'` : 'NULL'},
                        PRODUTOR.numeroConta = ${numeroConta ? `'${numeroConta}'` : 'NULL'},
                        PRODUTOR.tipoConta = ${tipoConta ? `'${tipoConta}'` : 'NULL'},
                        PRODUTOR.chavePix = ${chavePix ? `'${chavePix}'` : 'NULL'},
                        PRODUTOR.nomeCorrentista = ${nomeCorrentista ? `'${nomeCorrentista}'` : 'NULL'},
                        PRODUTOR.cpfCorrentista = ${cpfCorrentista ? `'${cpfCorrentista}'` : 'NULL'},
                        PRODUTOR.cnpjCorrentista = ${cnpjCorrentista ? `'${cnpjCorrentista}'` : 'NULL'},
                        PRODUTOR.pessoaContato = ${pessoaContato ? `'${pessoaContato}'` : 'NULL'},
                        PRODUTOR.emailPessoaContato = ${emailPessoaContato ? `'${emailPessoaContato}'` : 'NULL'},
                        PRODUTOR.telefoneFixoPessoaContato = ${telefoneFixoPessoaContato ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
                        PRODUTOR.telefoneCelularPessoaContato = ${telefoneCelularPessoaContato ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
                        PRODUTOR.observacao = ${observacao ? `'${observacao}'` : 'NULL'},
                        PRODUTOR.comissaoPorcentagem = ${comissaoPorcentagem ? comissaoPorcentagem.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                        PRODUTOR.premioMinimo = ${premioMinimo ? premioMinimo.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                        PRODUTOR.cnae = ${cnae ? `'${cnae}'` : 'NULL'},
                        PRODUTOR.cnaeDescricao = ${cnaeDescricao ? `'${cnaeDescricao}'` : 'NULL'},
                        PRODUTOR.capitalSocial = ${capitalSocial ? capitalSocial.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                        PRODUTOR.naturezaJuridica = ${naturezaJuridica ? `'${naturezaJuridica}'` : 'NULL'},
                        PRODUTOR.situacao = ${situacao ? `'${situacao}'` : 'NULL'},
                        PRODUTOR.dataAbertura = ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        PRODUTOR.dataUltimaAtualizacao = ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
                        PRODUTOR.tipoEmpresa = ${tipoEmpresa ? `'${tipoEmpresa}'` : 'NULL'},
                        PRODUTOR.porte = ${porte ? `'${porte}'` : 'NULL'},
                        PRODUTOR.dataSituacao = ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        PRODUTOR.motivoSituacao = ${motivoSituacao ? `'${motivoSituacao}'` : 'NULL'},
                        PRODUTOR.situacaoEspecial = ${situacaoEspecial ? `'${situacaoEspecial}'` : 'NULL'},
                        PRODUTOR.dataSituacaoEspecial = ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                        PRODUTOR.susep = ${susep ? `'${susep}'` : 'NULL'},
                        PRODUTOR.bloqueado = ${bloqueado ? bloqueado == true ? 1 : bloqueado == 0 ? false : 'null' : 'null'},
                        PRODUTOR.ad_upd = '${ad_upd}',
                        PRODUTOR.ad_usr = ${ad_usr ? ad_usr : 'NULL'}
                    where produtor_id = ${produtor_id}`;

        console.log(strsql);

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });

    }
};