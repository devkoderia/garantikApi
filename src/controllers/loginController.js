const md5 = require('md5');
const { executeQuery } = require('../services/generalFunctions');



const usuariosClientes = async (usuario_id) => {


    var strsql = `
    
    select 
    CL.cliente_id,
    C.cnpj, C.nomeFantasia, C.razaoSocial, CL.email, P.descricao as perfil, CL.produtor_id, CL.corretor_id, CL.perfil_id,
    CL.status, CL.ultimoAcesso
    from CLIENTE_USUARIO CL
    inner join CLIENTE C on CL.cliente_id = C.cliente_id
    left join PERFIL P on P.perfil_id = CL.perfil_id
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

        const strsql = `
            select distinct
            USUARIO.usuario_id,            
            USUARIO.nome,
            USUARIO.cpf,
            USUARIO.tipo
            from USUARIO
            where (USUARIO.deletado = 0 or USUARIO.deletado is null) and
            USUARIO.cpf = '${cpf}' and USUARIO.senha = '${hashedSenha}'`;

        //console.log(strsql)

        const resultado = await executeQuery(strsql);

        /* (CLIENTE_USUARIO.deletado = 0 or CLIENTE_USUARIO.deletado is null) and */



        if (resultado.length > 0) {

            const clientes = await usuariosClientes(resultado[0].usuario_id);

            if (clientes.length === 0) {
                return response.status(400).json([{ status: 'erro', mensagem: 'Usuário não está vinculado a um cliente' }]);
            }

            var dataBack = {

                usuario_id: resultado[0].usuario_id,
                tipo: resultado[0].tipo,                
                nome: resultado[0].nome,
                cpf: resultado[0].cpf,                
                descricao: resultado[0].descricao,
                clientes: clientes


            }

            response.status(200).send([dataBack]);

        } else {
            response.status(201).json([{ status: 'erro' }]);
        }

    },

};