const moment = require('moment')
const { enviaMail } = require('./emailController')
const md5 = require('md5')
const { executeQuery, escapeString } = require('../services/generalFunctions')

const geraChaveConvite = async (obj) => {

    var {

        ad_usr,
        cliente_id,
        nome,
        email,

    } = obj

    var ad_new = moment().format('YYYY-MM-DD HH:mm:ss')

    var chaveLink = md5(`${cliente_id}${ad_new}${email}`)


    var strsql = `
    
    insert into CONVITE 
    (
        nome,
        email,
        ad_new,
        ad_usr,
        cliente_id,
        chaveLink,
        expirado
    )
    values
    (
        '${nome}',
        '${email}',
        '${ad_new}',
        ${ad_usr},
        ${cliente_id},
        '${chaveLink}',
        0
    )
    
    `
    //console.log(strsql)
    //return false

    await executeQuery(strsql)

    return chaveLink


}



module.exports = {


    async valida(request, response) {


        var {

            chaveLink,
            cliente_id

        } = request.body

        var chaveLink = await escapeString(chaveLink)

        var strsql = `        
        select 
        C.convite_id, C.nomeFantasia, V.email, V.nome
        from CONVITE V
        inner join CLIENTE C on V.cliente_id = C.cliente_id
        where (C.deletado = 0 or C.deletado is null)
        and V.chaveLink = '${chaveLink}' and V.cliente_id = ${cliente_id}        
        `

        //adicionar na query se o cpf já existe usuario_id

        const resultado = await executeQuery(strsql)

        response.status(200).send(resultado)


    },


    async create(request, response) {


        var {

            nome,
            cliente_id,
            email,
            nomeFantasia,
            ad_usr,

        } = request.body


        const chaveLink = await geraChaveConvite({

            cliente_id: cliente_id,
            email: email,
            nome: nome,
            ad_usr: ad_usr,

        })

        //console.log(chaveLink)
        //return false

        var texto = `
        
        <html>

        Olá ${nome}!
        
        <br><br>

        Você foi convidado para fazer parte da equipe da <b>${nomeFantasia}</b>. Por favor, clique no link abaixo ou copie e cole no seu navegador para prosseguir com o cadastro:

        <br><br>

        <a href="https://www.garantik.com.br/03!ZXq/${cliente_id}/${chaveLink}">https://www.garantik.com.br/03!ZXqW771/${cliente_id}/${chaveLink}</a>

        <br><br><br>

        * Este e-mail é apenas informativo, não responda-o.

        <br><br><br>

        <b><font color="brown">${nomeFantasia}</font></b>

        </html>
        
        `


        /*
        await enviaMail({


            emailDestino: email,
            titulo: 'Convite',
            texto: texto,

        })
        */



        response.status(200).send({ status: 'ok' })


    },


    async expira(convite_id) {

        const strsql = `update CONVITE set expirado = 1 where convite_id = ${convite_id}`

        await executeQuery(strsql)

        return true

    }

}