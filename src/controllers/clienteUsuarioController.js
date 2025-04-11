const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async insereUsuarioAutoCadastroCliente(obj) {

        var {
            cliente_id,
            usuario_id,
            email,
            telefone,
            ad_usr } = obj

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;

        const strsql = `insert into CLIENTE_USUARIO (
            cliente_id,
            usuario_id,
            email, 
            telefone, 
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${usuario_id},
            '${email}',
            '${telefone}',
            '${ad_new}',
            '${ad_upd}',            
            ${ad_usr},
            0
        )`;

        //insert cliente_usuario
        await executeQuery(strsql);

        return true
    },


    async consultaClienteUsuarioExistenteId(cliente_id, usuario_id) {

        const strsql = `SELECT clienteUsuario_id
                                FROM CLIENTE_USUARIO
                                WHERE cliente_id = ${cliente_id}
                                AND usuario_id = ${usuario_id}
                                AND (deletado = 0 OR deletado IS NULL)`

        const resultado = await executeQuery(strsql);

        return resultado
    },


    //--------------------------------------------------------------------------------------------------------------------------------

    async consultaClienteUsuarioCpf(request, response) {

        var { cpf } = request.params
        var { cliente_id } = request.body

        const strsql = `select USUARIO.usuario_id,
                            CLIENTE_USUARIO.clienteUsuario_id,
                            USUARIO.cpf, 
                            USUARIO.nome 
                            from USUARIO
                            inner join CLIENTE_USUARIO on CLIENTE_USUARIO.usuario_id = USUARIO.usuario_id
                            where cpf = '${cpf}' and cliente_id = ${cliente_id} and
                            (USUARIO.deletado = 0 OR USUARIO.deletado IS NULL) and 
                            (CLIENTE_USUARIO.deletado = 0 OR CLIENTE_USUARIO.deletado IS NULL)`

        const resultado = await executeQuery(strsql);

        response.status(200).send(resultado);
    },

    async count(_, response) {
        const strsql = `
            SELECT count(*) as total 
            FROM CLIENTE_USUARIO 
            WHERE (deletado = 0 OR deletado IS NULL) and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { clienteUsuario_id } = request.params;

        const strsql = `
            UPDATE CLIENTE_USUARIO 
            SET deletado = 1 
            WHERE clienteUsuario_id = ${clienteUsuario_id}
        `;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {
        const { clienteUsuario_id } = request.params;
        const strsql = `
            SELECT 
                clienteUsuario_id,
                cliente_id,
                usuario_id,
                produtor_id,
                corretor_id,
                perfil_id,
                email,
                telefone,
                status,
                numeroAcessos,
                CONVERT(VARCHAR, USUARIO.ultimoAcesso, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ultimoAcesso,
                ip,
                status,
                CONVERT(VARCHAR, ad_new, 103) + ' ' + CONVERT(VARCHAR, ad_new, 8) AS ad_new,
                CONVERT(VARCHAR, ad_upd, 103) + ' ' + CONVERT(VARCHAR, ad_upd, 8) AS ad_upd,
                bloqueado,
                deletado
            FROM CLIENTE_USUARIO
            WHERE (deletado = 0 OR deletado IS NULL)
              AND clienteUsuario_id = ${clienteUsuario_id} and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async listaTodos(request, response) {

        const strsql = `
            SELECT 
                clienteUsuario_id,
                cliente_id,
                usuario_id,
                produtor_id,
                corretor_id,
                perfil_id,
                email,
                telefone,
                status,
                numeroAcessos,
                CONVERT(VARCHAR, USUARIO.ultimoAcesso, 103) + ' ' + CONVERT(VARCHAR, USUARIO.ad_new, 8) as ultimoAcesso,
                ip,
                status,
                CONVERT(VARCHAR, ad_new, 103) + ' ' + CONVERT(VARCHAR, ad_new, 8) AS ad_new,
                CONVERT(VARCHAR, ad_upd, 103) + ' ' + CONVERT(VARCHAR, ad_upd, 8) AS ad_upd,
                bloqueado,
                deletado
            FROM CLIENTE_USUARIO
            WHERE (deletado = 0 OR deletado IS NULL) and cliente_id = ${cliente_id}
        `;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {

        const {
            cliente_id,
            usuario_id,
            produtor_id,
            corretor_id,
            perfil_id,
            email,
            telefone,
            status,
            ad_usr,
        } = request.body;

        // Use default values if not provided
        const bloqueadoValue = bloqueado !== undefined ? bloqueado : 0;
        const deletado = 0;
        const ad_new = moment().format('YYYY-MM-DD HH:mm:ss');
        const ad_upd = ad_new;

        const strsql = `
            INSERT INTO CLIENTE_USUARIO (
                cliente_id,
                usuario_id,
                produtor_id,
                corretor_id,
                perfil_id,
                email,
                telefone,
                status,
                ad_usr,
                ad_new,
                ad_upd,
                bloqueado,
                deletado
            ) OUTPUT INSERTED.clienteUsuario_id VALUES (
                ${cliente_id},
                ${usuario_id},
                ${produtor_id},
                ${corretor_id},
                ${perfil_id},
                '${email}',
                '${telefone}',
                '${status}',
                ${ad_usr},
                '${ad_new}',
                '${ad_upd}',
                ${bloqueadoValue},
                ${deletado}
            )
        `;

        const result = await executeQuery(strsql);
        response.status(200).json([{ status: 'ok', clienteUsuario_id: result[0].clienteUsuario_id }]);
    },

    async update(request, response) {

        const { clienteUsuario_id } = request.params;
        const {
            cliente_id,
            usuario_id,
            produtor_id,
            corretor_id,
            perfil_id,
            email,
            telefone,
            status,
            ad_usr,
            bloqueado,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:mm:ss');

        const strsql = `
            UPDATE CLIENTE_USUARIO SET 
                cliente_id = ${cliente_id},
                usuario_id = ${usuario_id},
                produtor_id = ${produtor_id},
                corretor_id = ${corretor_id},
                perfil_id = ${perfil_id},
                email = '${email}',
                telefone = '${telefone}',
                status = '${status}',
                bloqueado = ${bloqueado},
                ad_usr = ${ad_usr},
                ad_upd = '${ad_upd}'
            WHERE clienteUsuario_id = ${clienteUsuario_id}
        `;

        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    },
};
