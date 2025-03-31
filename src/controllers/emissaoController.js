const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async listaEmissao(emissao_id, cliente_id) {

        const strsql = `select 
            EMISSAO.emissao_id,
            EMISSAO.cliente_id,
            EMISSAO.pin,
            CONVERT(VARCHAR, EMISSAO.dataEmissao, 103) as dataEmissao,
            CONVERT(VARCHAR, EMISSAO.dataInicio, 103) as dataInicio,
            CONVERT(VARCHAR, EMISSAO.dataVencimento, 103) as dataVencimento,
            EMISSAO.dias,
            EMISSAO.dataVencimentoIndeterminado,
            EMISSAO.valor,
            EMISSAO.valorExtenso,
            EMISSAO.modalidade_id,
            EMISSAO.modalidadeTexto,
            EMISSAO.objeto,
            EMISSAO.textoFianca,
            EMISSAO.documento,
            EMISSAO.sinistro,
            EMISSAO.bloqueada,
            EMISSAO.taxa,
            EMISSAO.premio,
            EMISSAO.pago,
            EMISSAO.valorPago,
            EMISSAO.minuta,
            EMISSAO.garantia,
            EMISSAO.trabalhista,
            CONVERT(VARCHAR, EMISSAO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_upd, 8) as ad_upd,
            EMISSAO.ad_usr,
            EMISSAO.deletado
            from EMISSAO
            where (EMISSAO.deletado = 0 or EMISSAO.deletado is null) and emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);

        return resultado
    },

    //----------------------------------------------------------------

    async count(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select count(*) as total from EMISSAO where (deletado = 0 or deletado is null) and cliente_id = ${cliente_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async destroy(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO set deletado = 1 where emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`;
        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async listaTodos(request, response) {

        const { cliente_id } = request.body;

        const strsql = `select 
            EMISSAO.emissao_id,
            EMISSAO.cliente_id,
            EMISSAO.pin,
            CONVERT(VARCHAR, EMISSAO.dataEmissao, 103) as dataEmissao,
            CONVERT(VARCHAR, EMISSAO.dataInicio, 103) as dataInicio,
            CONVERT(VARCHAR, EMISSAO.dataVencimento, 103) as dataVencimento,
            EMISSAO.dias,
            EMISSAO.dataVencimentoIndeterminado,
            EMISSAO.valor,
            EMISSAO.valorExtenso,
            EMISSAO.modalidade_id,
            EMISSAO.modalidadeTexto,
            EMISSAO.objeto,
            EMISSAO.textoFianca,
            EMISSAO.documento,
            EMISSAO.sinistro,
            EMISSAO.bloqueada,
            EMISSAO.taxa,
            EMISSAO.premio,
            EMISSAO.pago,
            EMISSAO.valorPago,
            EMISSAO.minuta,
            EMISSAO.garantia,
            CONVERT(VARCHAR, EMISSAO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_upd, 8) as ad_upd,
            EMISSAO.ad_usr,
            EMISSAO.deletado
            from EMISSAO
            where (EMISSAO.deletado = 0 or EMISSAO.deletado is null) and cliente_id = ${cliente_id}`;

        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async create(request, response) {
        const {
            cliente_id,
            pin,
            dataEmissao,
            dataInicio,
            dataVencimento,
            dias,
            dataVencimentoIndeterminado,
            valor,
            valorExtenso,
            modalidade_id,
            modalidadeTexto,
            objeto,
            textoFianca,
            documento,
            sinistro,
            bloqueada,
            taxa,
            premio,
            pago,
            valorPago,
            minuta,
            garantia,
            ad_usr
        } = request.body;

        const ad_new = moment().format('YYYY-MM-DD HH:MM:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const strsql = `insert into EMISSAO (
            cliente_id,
            pin,
            dataEmissao,
            dataInicio,
            dataVencimento,
            dias,
            dataVencimentoIndeterminado,
            valor,
            valorExtenso,
            modalidade_id,
            modalidadeTexto,
            objeto,
            textoFianca,
            documento,
            sinistro,
            bloqueada,
            taxa,
            premio,
            pago,
            valorPago,
            minuta,
            garantia,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            '${pin}',
            '${dataEmissao}',
            '${dataInicio}',
            '${dataVencimento}',
            ${dias},
            ${dataVencimentoIndeterminado},
            ${valor},
            '${valorExtenso}',
            ${modalidade_id},
            '${modalidadeTexto}',
            '${objeto}',
            '${textoFianca}',
            '${documento}',
            ${sinistro},
            ${bloqueada},
            '${taxa}',
            '${premio}',
            ${pago},
            ${valorPago},
            ${minuta},
            ${garantia},
            '${ad_new}',
            '${ad_upd}',
            ${ad_usr},
            ${deletado}
        )`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    },

    async update(request, response) {

        const { emissao_id } = request.params;
        const {
            cliente_id,
            pin,
            dataEmissao,
            dataInicio,
            dataVencimento,
            dias,
            dataVencimentoIndeterminado,
            valor,
            valorExtenso,
            modalidade_id,
            modalidadeTexto,
            objeto,
            textoFianca,
            documento,
            sinistro,
            bloqueada,
            taxa,
            premio,
            pago,
            valorPago,
            minuta,
            garantia,
            ad_usr
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:MM:ss');

        const strsql = `update EMISSAO set 
            cliente_id = ${cliente_id},
            pin = '${pin}',
            dataEmissao = '${dataEmissao}',
            dataInicio = '${dataInicio}',
            dataVencimento = '${dataVencimento}',
            dias = ${dias},
            dataVencimentoIndeterminado = ${dataVencimentoIndeterminado},
            valor = ${valor},
            valorExtenso = '${valorExtenso}',
            modalidade_id = ${modalidade_id},
            modalidadeTexto = '${modalidadeTexto}',
            objeto = '${objeto}',
            textoFianca = '${textoFianca}',
            documento = '${documento}',
            sinistro = ${sinistro},
            bloqueada = ${bloqueada},
            taxa = '${taxa}',
            premio = '${premio}',
            pago = ${pago},
            valorPago = ${valorPago},
            minuta = ${minuta},
            garantia = ${garantia},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr}
            where emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`;

        await executeQuery(strsql);
        response.status(200).json([{ status: 'ok' }]);
    }
};