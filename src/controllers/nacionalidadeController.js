const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async index(_, response) {

        const strsql = `select 
            nacionalidade_id,
            descricao
            from NACIONALIDADE
            order by descricao`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },
    
};