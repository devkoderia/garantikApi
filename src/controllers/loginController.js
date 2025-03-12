const md5 = require('md5');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async login(request, response) {

        const { cpf, senha } = request.body;
        const hashedSenha = md5(senha);

        const strsql = `select 
            USUARIO.cliente_id, 
            USUARIO.usuario_id, 
            USUARIO.perfil_id, 
            USUARIO.produtor_id, 
            USUARIO.corretor_id,                 
            USUARIO.nome, 
            USUARIO.cpf,
            USUARIO.email,
            PERFIL.descricao as perfilDescricao,
            CONVERT(VARCHAR, USUARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ad_new, 
            CONVERT(VARCHAR, USUARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_upd, 8) as ad_upd, 
            USUARIO.ad_usr 
            from USUARIO 
            inner join PERFIL on PERFIL.perfil_id = USUARIO.perfil_id 
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) 
            and USUARIO.cpf = '${cpf}' and USUARIO.senha = '${hashedSenha}'`;

        const resultado = await executeQuery(strsql);

        if (resultado.length > 0) {
            response.status(200).send(resultado);
        } else {
            response.status(201).json([{ status: 'erro'}]);
        }

    },

};