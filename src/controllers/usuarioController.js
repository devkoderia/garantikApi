const moment = require('moment-timezone');
const { executeQuery, sendEmail, escapeString } = require('../services/generalFunctions');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

module.exports = {

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from USUARIO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { usuario_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update USUARIO set deletado = 1 where usuario_id = ${usuario_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaCpf(request, response) {

        const { cpf } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            CLIENTE_USUARIO.cliente_id,
            USUARIO.perfil_id,
            PERFIL.descricao as perfilDescricao,
            USUARIO.produtor_id,
            USUARIO.corretor_id,
            USUARIO.cpf,
            USUARIO.nome,
            USUARIO.email,
            USUARIO.numeroAcessos,
            CONVERT(VARCHAR, USUARIO.ultimoAcesso, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ultimoAcesso,
            USUARIO.ip,
            USUARIO.bloqueado,
            CONVERT(VARCHAR, USUARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, USUARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_upd, 8) as ad_upd,
            USUARIO.ad_usr,
            B.nome as adUsrNome,
            USUARIO.deletado
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
            inner join USUARIO B on B.usuario_id = USUARIO.ad_usr
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and USUARIO.cpf = '${cpf}' and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async show(request, response) {

        const { usuario_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            CLIENTE_USUARIO.cliente_id,
            USUARIO.perfil_id,
            PERFIL.descricao as perfilDescricao,
            USUARIO.produtor_id,
            USUARIO.corretor_id,
            USUARIO.cpf,
            USUARIO.nome,
            USUARIO.email,
            USUARIO.numeroAcessos,
            CONVERT(VARCHAR, USUARIO.ultimoAcesso, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ultimoAcesso,
            USUARIO.ip,
            USUARIO.bloqueado,
            USUARIO.telefone,
            CLIENTE_USUARIO.status,
            CONVERT(VARCHAR, USUARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, USUARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_upd, 8) as ad_upd,
            USUARIO.ad_usr,
            USUARIO.deletado
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and 
            (CLIENTE_USUARIO.deletado = 0 or CLIENTE_USUARIO.deletado is null) and 
            USUARIO.usuario_id = ${usuario_id} and CLIENTE_USUARIO.cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);

    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            CLIENTE_USUARIO.cliente_id,
            USUARIO.perfil_id,
            PERFIL.descricao as perfilDescricao,
            USUARIO.produtor_id,
            USUARIO.corretor_id,
            USUARIO.cpf,
            USUARIO.nome,
            USUARIO.email,
            USUARIO.numeroAcessos,
            CONVERT(VARCHAR, USUARIO.ultimoAcesso, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ultimoAcesso,
            USUARIO.ip,
            USUARIO.bloqueado,
            CLIENTE_USUARIO.status,
            CONVERT(VARCHAR, USUARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, USUARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_upd, 8) as ad_upd,
            USUARIO.ad_usr,
            USUARIO.deletado
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and 
            (CLIENTE_USUARIO.deletado = 0 or CLIENTE_USUARIO.deletado is null) and 
            CLIENTE_USUARIO.cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTabela(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            PERFIL.descricao as perfilDescricao,
            USUARIO.cpf,
            USUARIO.nome
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and CLIENTE_USUARIO.cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        var {
            cliente_id,
            perfil_id,
            produtor_id,
            corretor_id,
            cpf,
            nome,
            email,
            senha,
            ad_usr,
            telefone,
        } = request.body;

        var nome = await escapeString(nome)
        var cpf = await escapeString(cpf)
        var email = await escapeString(email)
        var senha = await escapeString(senha)
        var telefone = await escapeString(telefone)

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const hashedSenha = md5(senha);

        const strsqlConsulta = `select usuario_id from USUARIO where cpf = '${cpf}' and cliente_id = ${cliente_id} AND (deletado = 0 OR deletado IS NULL)`
        const resultadoConsulta = await executeQuery(strsqlConsulta);

        if (resultadoConsulta && resultadoConsulta.length > 0) {
            return response.status(201).json([{ status: 'erro', descricao: 'Usuário já cadastrado nesse cliente.' }]);
        }
        

        const strsql = `insert into USUARIO (
            cliente_id,
            perfil_id,
            produtor_id,
            corretor_id,
            cpf,
            nome,
            email,
            senha,
            ad_new,
            ad_upd,
            ad_usr,
            telefone,
            deletado
        ) OUTPUT INSERTED.usuario_id VALUES (
            ${cliente_id},
            ${perfil_id},
            ${produtor_id || null},
            ${corretor_id || null},
            '${cpf}',
            '${nome}',
            '${email}',
            '${hashedSenha}',
            '${ad_new}',
            '${ad_upd}',
            '${telefone}',
            ${ad_usr},
            0
        )`;

        const resultado = await executeQuery(strsql);

        // Obtém o usuario_id inserido
        const insertedUsuarioId = resultado[0].usuario_id;

        const strsqlConsultaCliente = `SELECT clienteUsuario_id
                            FROM CLIENTE_USUARIO
                            WHERE cliente_id = ${cliente_id}
                            AND usuario_id = ${insertedUsuarioId}
                            AND (deletado = 0 OR deletado IS NULL)
                        `;

        const resultadoConsultaCliente = await executeQuery(strsqlConsultaCliente);

        if (resultadoConsultaCliente && resultadoConsultaCliente.length > 0) {
            return response.status(201).json({ status: 'erro', erro: 'Usuário já está cadastrado nesse cliente.' });
        }

        const strsqlCliente = `INSERT INTO CLIENTE_USUARIO (
                            cliente_id,
                            usuario_id,
                            status,
                            ad_new,
                            ad_upd,
                            bloqueado,
                            deletado
                        ) VALUES (
                            ${cliente_id},
                            ${insertedUsuarioId},
                            'P',
                            '${ad_new}',
                            '${ad_upd}',
                            0,
                            0
                        )`;

        await executeQuery(strsqlCliente);

        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { usuario_id } = request.params;

        var {
            cliente_id,
            perfil_id,
            produtor_id,
            corretor_id,
            nome,
            email,
            ad_usr,
            bloqueado,
            telefone,
        } = request.body;

        var nome = await escapeString(nome)
        var cpf = await escapeString(cpf)
        var email = await escapeString(email)
        var senha = await escapeString(senha)
        var telefone = await escapeString(telefone)

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update USUARIO set 
            perfil_id = ${perfil_id},
            produtor_id = ${produtor_id || null},
            corretor_id = ${corretor_id || null},
            nome = '${nome}',
            email = '${email}',
            bloqueado = ${bloqueado || 0},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr},
            telefone = '${telefone}'
            where usuario_id = ${usuario_id} and cliente_id = ${cliente_id}`

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);

    },

    async alteraSenha(request, response) {

        const { usuario_id } = request.params;
        const { cliente_id, senha, ad_usr } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');
        const hashedSenha = md5(senha);

        const strsql = `update USUARIO set
            senha = '${hashedSenha}',
            ad_usr = ${ad_usr},
            ad_upd = '${ad_upd}'
            where cliente_id = ${cliente_id} and usuario_id = ${usuario_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async recuperaSenha(request, response) {

        const { token } = request.params
        const { senha } = request.body

        const secretKey = process.env.JWT_SECRET

        // Tente decodificar o token
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            return response.status(201).json({ status: 'erro', descricao: 'Token inválido ou expirado.' });
        }

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');
        const hashedSenha = md5(senha);

        const strsql = `update USUARIO set
            senha = '${hashedSenha}',
            ad_upd = '${ad_upd}'
            where usuario_id = ${usuario_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);

    },

    async enviaEmailRecuperacaoSenha(request, response) {

       const {usuario_id}  = request.params
       const tipo = 'senha'

       sendEmail(usuario_id, tipo)

       response.status(200).json([{ status: 'ok' }]);


    },


    async clienteUsuario(request, response) {

        const { usuario_id, cliente_id, ad_usr } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new
        
        const strsql = `update USUARIO set
            deletado = 1            
            where cliente_id = ${cliente_id} and usuario_id = ${usuario_id};
            
            insert INTO CLIENTE_USUARIO (
                cliente_id,
                usuario_id,
                status,
                ad_new,
                ad_upd,
                bloqueado,
                deletado,
                ad_usr
            ) values (
                ${cliente_id},
                ${usuario_id},
                'P',
                '${ad_new}',
                '${ad_upd}',
                0,
                0,
                ${ad_usr}
            );
            
            `;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },
};