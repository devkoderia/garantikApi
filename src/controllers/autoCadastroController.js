const moment = require('moment-timezone');
const { executeQuery, sendEmail, escapeString } = require('../services/generalFunctions');
const { expira } = require('./conviteController');
const { consultaUsuarioExistenteCpf, insereUsuarioAutoCadastro } = require('./usuarioController');
const { insereUsuarioAutoCadastroCliente, consultaClienteUsuarioExistenteId } = require('./clienteUsuarioController');
const md5 = require('md5');

module.exports = {

    async index(request, response) {

        var {
            convite_id,
            cliente_id,
            cpf,
            nome,
            email,
            telefone,
            senha,
        } = request.body;

        var cpf = await escapeString(cpf)
        var nome = await escapeString(nome)
        var email = await escapeString(email)
        var telefone = await escapeString(telefone)
        var senha = await escapeString(senha)
        var resultadoInsert = ''
        var resultadoInsertCliente = ''

        const hashedSenha = md5(senha);
        const ad_usr = 1

        const resultadoConsulta = await consultaUsuarioExistenteCpf(cpf)

        if (resultadoConsulta && resultadoConsulta.length > 0) { //se o usuário existir na tabela USUARIO

            var usuario_id = resultadoConsulta[0].usuario_id

            //verifica se o usuario_id consta na tabela CLIENTE_USUARIO
            const resultadoConsultaCliente = await consultaClienteUsuarioExistenteId(cliente_id, usuario_id) 

            if (resultadoConsultaCliente && resultadoConsultaCliente.length > 0) { //Se já existir nas duas tabelas devolve erro
                return response.status(201).json({ status: 'erro', erro: 'Usuário já está cadastrado nesse cliente.' });
            } else {

                //Se só existir na USUARIO mas não existir na CLIENTE_USUARIO
                
                const obj = {
                    cliente_id, 
                    usuario_id, 
                    email, 
                    telefone, 
                    ad_usr
                }
                
                await insereUsuarioAutoCadastroCliente(obj)

            }

        } else { //se não existir na tabela USUARIO então insere

            resultadoInsert = await insereUsuarioAutoCadastro(cpf, nome, hashedSenha, ad_usr)            

        }

        if (resultadoInsert && resultadoInsert.length > 0) { //se deu certo o insert, insere também na CLIENTE_USUARIO

            var usuario_id = resultadoInsert[0].usuario_id

            await insereUsuarioAutoCadastroCliente(cliente_id, usuario_id, email, telefone, ad_usr)

            await expira(convite_id)

            response.status(200).json([{ status: 'ok' }]);

        } else { //se deu errado, retorna erro.

            return response.status(201).json({ status: 'erro', erro: 'Erro ao inserir o usuário.' });

        }


    },


}