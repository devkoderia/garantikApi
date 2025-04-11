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
        response.status(200).json({ status: 'ok' });
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
                CONVERT(VARCHAR, CORRETOR.dataSituacao, 103) as dataSituacao,                
                CORRETOR.motivoSituacao,
                CORRETOR.situacaoEspecial,
                CONVERT(VARCHAR, CORRETOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
                CONVERT(VARCHAR, CORRETOR.dataAbertura, 103) as dataAbertura,
                CONVERT(VARCHAR, CORRETOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
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
                CORRETOR.nomeCorrentista,
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
                CORRETOR.nomeCorrentista,
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
                CONVERT(VARCHAR, CORRETOR.dataSituacao, 103) as dataSituacao,                
                CONVERT(VARCHAR, CORRETOR.dataSituacaoEspecial, 103) as dataSituacaoEspecial,
                CORRETOR.tipoEmpresa,
                CORRETOR.porte,
                CONVERT(VARCHAR, CORRETOR.dataAbertura, 103) as dataAbertura,
                CORRETOR.motivoSituacao,
                CORRETOR.situacaoEspecial,
                CONVERT(VARCHAR, CORRETOR.dataUltimaAtualizacao, 103) + ' ' + CONVERT(VARCHAR, CORRETOR.dataUltimaAtualizacao, 8) as dataUltimaAtualizacao,
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
            ) OUTPUT INSERTED.corretor_id VALUES (
                ${cliente_id},
                ${produtor_id},
                ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
                ${cpf ? `'${cpf}'` : 'NULL'},
                ${cnpj ? `'${cnpj}'` : 'NULL'},
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

        const strsql = `update CORRETOR set 
                CORRETOR.cliente_id = ${cliente_id},
                CORRETOR.produtor_id = ${produtor_id},
                CORRETOR.tipoJuridico = ${tipoJuridico ? `'${tipoJuridico}'` : 'NULL'},
                CORRETOR.cpf = ${cpf ? `'${cpf}'` : 'null'},
                CORRETOR.cnpj = ${cnpj ? `'${cnpj}'` : 'null'},
                CORRETOR.nome = ${nome ? `'${nome.toUpperCase()}'` : 'NULL'},
                CORRETOR.nomeFantasia = ${nomeFantasia ? `'${nomeFantasia.toUpperCase()}'` : 'NULL'},
                CORRETOR.razaoSocial = ${razaoSocial ? `'${razaoSocial.toUpperCase()}'` : 'NULL'},
                CORRETOR.cep = ${cep ? `'${cep}'` : 'NULL'},
                CORRETOR.ibge_codigo = ${ibge_codigo ? `'${ibge_codigo}'` : 'NULL'},
                CORRETOR.ibge_descri = ${ibge_descri ? `'${ibge_descri}'` : 'NULL'},
                CORRETOR.uf = ${uf ? `'${uf}'` : 'NULL'},
                CORRETOR.logradouro = ${logradouro ? `'${logradouro}'` : 'NULL'},
                CORRETOR.numero = ${numero ? `'${numero}'` : 'NULL'},
                CORRETOR.complemento = ${complemento ? `'${complemento}'` : 'NULL'},
                CORRETOR.bairro = ${bairro ? `'${bairro}'` : 'NULL'},
                CORRETOR.telefoneFixo = ${telefoneFixo ? `'${telefoneFixo}'` : 'NULL'},
                CORRETOR.telefoneCelular = ${telefoneCelular ? `'${telefoneCelular}'` : 'NULL'},
                CORRETOR.email = ${email ? `'${email}'` : 'NULL'},
                CORRETOR.nacionalidade_id = ${nacionalidade_id ? nacionalidade_id : 'NULL'},
                CORRETOR.estadoCivil = ${estadoCivil ? `'${estadoCivil}'` : 'NULL'},
                CORRETOR.profissao = ${profissao ? `'${profissao}'` : 'NULL'},
                CORRETOR.banco_id = ${banco_id ? banco_id : 'NULL'},
                CORRETOR.agencia = ${agencia ? `'${agencia}'` : 'NULL'},
                CORRETOR.numeroConta = ${numeroConta ? `'${numeroConta}'` : 'NULL'},
                CORRETOR.tipoConta = ${tipoConta ? `'${tipoConta}'` : 'NULL'},
                CORRETOR.chavePix = ${chavePix ? `'${chavePix}'` : 'NULL'},
                CORRETOR.nomeCorrentista = ${nomeCorrentista ? `'${nomeCorrentista}'` : 'NULL'},
                CORRETOR.cpfCorrentista = ${cpfCorrentista ? `'${cpfCorrentista}'` : 'NULL'},
                CORRETOR.cnpjCorrentista = ${cnpjCorrentista ? `'${cnpjCorrentista}'` : 'NULL'},
                CORRETOR.pessoaContato = ${pessoaContato ? `'${pessoaContato}'` : 'NULL'},
                CORRETOR.emailPessoaContato = ${emailPessoaContato ? `'${emailPessoaContato}'` : 'NULL'},
                CORRETOR.telefoneFixoPessoaContato = ${telefoneFixoPessoaContato ? `'${telefoneFixoPessoaContato}'` : 'NULL'},
                CORRETOR.telefoneCelularPessoaContato = ${telefoneCelularPessoaContato ? `'${telefoneCelularPessoaContato}'` : 'NULL'},
                CORRETOR.observacao = ${observacao ? `'${observacao}'` : 'NULL'},
                CORRETOR.comissaoPorcentagem = ${comissaoPorcentagem ? comissaoPorcentagem.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                CORRETOR.premioMinimo = ${premioMinimo ? premioMinimo.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                CORRETOR.cnae = ${cnae ? `'${cnae}'` : 'NULL'},
                CORRETOR.cnaeDescricao = ${cnaeDescricao ? `'${cnaeDescricao}'` : 'NULL'},
                CORRETOR.capitalSocial = ${capitalSocial ? capitalSocial.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                CORRETOR.naturezaJuridica = ${naturezaJuridica ? `'${naturezaJuridica}'` : 'NULL'},
                CORRETOR.situacao = ${situacao ? `'${situacao}'` : 'NULL'},
                CORRETOR.dataAbertura = ${dataAbertura ? `'${moment(dataAbertura).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                CORRETOR.dataUltimaAtualizacao = ${dataUltimaAtualizacao ? `'${moment(dataUltimaAtualizacao).utc().format('YYYY-MM-DD HH:mm:ss')}'` : 'NULL'},
                CORRETOR.tipoEmpresa = ${tipoEmpresa ? `'${tipoEmpresa}'` : 'NULL'},
                CORRETOR.porte = ${porte ? `'${porte}'` : 'NULL'},
                CORRETOR.dataSituacao = ${dataSituacao ? `'${moment(dataSituacao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                CORRETOR.motivoSituacao = ${motivoSituacao ? `'${motivoSituacao}'` : 'NULL'},
                CORRETOR.situacaoEspecial = ${situacaoEspecial ? `'${situacaoEspecial}'` : 'NULL'},
                CORRETOR.dataSituacaoEspecial = ${dataSituacaoEspecial ? `'${moment(dataSituacaoEspecial).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                CORRETOR.susep = ${susep ? `'${susep}'` : 'NULL'},                
                CORRETOR.bloqueado = ${bloqueado == true ? 1 : bloqueado == false ? 0 : 'NULL'},
                CORRETOR.ad_upd = '${ad_upd}',
                CORRETOR.ad_usr = ${ad_usr ? ad_usr : 'NULL'}
            where corretor_id = ${corretor_id}`;

        console.log(strsql)
        //return false

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },
};