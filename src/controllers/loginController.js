const md5 = require('md5');
const { executeQuery } = require('../services/generalFunctions');



const usuariosClientes = async (usuario_id) => {


    var strsql = `
    
    select 
    CL.cliente_id,
    C.cnpj, C.nomeFantasia, C.razaoSocial
    from CLIENTE_USUARIO CL
    inner join CLIENTE C on CL.cliente_id = C.cliente_id
    where (CL.deletado = 0 or CL.deletado is null)
    and CL.usuario_id = ${usuario_id}
    and (C.deletado = 0 or C.deletado is null)
    order by C.nomeFantasia

    `

    return await executeQuery(strsql)

}


module.exports = {

    async login(request, response) {

        const { cpf, senha } = request.body;
        const hashedSenha = md5(senha);

        const strsql = `select distinct
            USUARIO.usuario_id,
            CLIENTE_USUARIO.perfil_id,
            CLIENTE_USUARIO.produtor_id,
            CLIENTE_USUARIO.corretor_id,
            USUARIO.nome,
            USUARIO.cpf,
            USUARIO.email,
            PERFIL.descricao as perfilDescricao,
            CONVERT(VARCHAR, USUARIO.ad_new, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, USUARIO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_upd, 8) as ad_upd
            from USUARIO
            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
            inner join PERFIL on PERFIL.perfil_id = CLIENTE_USUARIO.perfil_id
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and
			(CLIENTE_USUARIO.deletado = 0 or CLIENTE_USUARIO.deletado is null) and
            USUARIO.cpf = '${cpf}' and USUARIO.senha = '${hashedSenha}'`;

        console.log(strsql)

        const resultado = await executeQuery(strsql);

        /* (CLIENTE_USUARIO.deletado = 0 or CLIENTE_USUARIO.deletado is null) and */



        if (resultado.length > 0) {

            const clientes = await usuariosClientes(resultado[0].usuario_id);

            if (clientes.length === 0) {
                return response.status(400).json([{ status: 'erro', mensagem: 'Usuário não está vinculado a um cliente' }]);
            }

            var dataBack = {

                usuario_id: resultado[0].usuario_id,
                perfil_id: resultado[0].perfil_id,
                produtor_id: resultado[0].produtor_id,
                corretor_id: resultado[0].corretor_id,
                nome: resultado[0].nome,
                cpf: resultado[0].cpf,
                email: resultado[0].email,
                descricao: resultado[0].descricao,
                clientes: clientes


            }

            response.status(200).send([dataBack]);

        } else {
            response.status(201).json([{ status: 'erro' }]);
        }

    },

};