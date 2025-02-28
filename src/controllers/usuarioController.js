const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');
const md5 = require('md5');

function removeBreaks(strsql) {
    return strsql.replace(/\s\s+/g, ' ');
}

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

    async listaUm(request, response) {

        const { usuario_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            USUARIO.cliente_id,
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
            B.nome as usuarioNome,
            USUARIO.deletado
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            inner join USUARIO B on B.usuario_id = USUARIO.ad_usr
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and USUARIO.usuario_id = ${usuario_id} and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id,
            USUARIO.cliente_id,
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
            USUARIO.deletado
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTabela(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            USUARIO.usuario_id as id,
            PERFIL.descricao as perfilDescricao,
            USUARIO.cpf,
            USUARIO.nome
            from USUARIO
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            perfil_id,
            produtor_id,
            corretor_id,
            cpf,
            nome,
            email,
            senha,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const hashedSenha = md5(senha);

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
            deletado
        ) VALUES (
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
            ${ad_usr},
            0
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { usuario_id } = request.params;
        const {
            cliente_id,
            perfil_id,
            produtor_id,
            corretor_id,
            nome,
            email,
            ad_usr,
            bloqueado
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update USUARIO set 
            perfil_id = ${perfil_id},
            produtor_id = ${produtor_id || null},
            corretor_id = ${corretor_id || null},
            nome = '${nome}',
            email = '${email}',
            bloqueado = ${bloqueado || 0},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
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
    }
};