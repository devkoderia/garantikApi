const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async index(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;


        //pega a emissão
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
            where (EMISSAO.deletado = 0 or EMISSAO.deletado is null) and emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`

        const resultado = await executeQuery(strsql);

        if (resultado.length > 0) {

            const strsqlFavorecido = `select 
            EMISSAO_FAVORECIDO.emissaoFavorecido_id,
            EMISSAO_FAVORECIDO.cliente_id,
            EMISSAO_FAVORECIDO.emissao_id,
            EMISSAO_FAVORECIDO.favorecido_id,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_FAVORECIDO.ad_upd, 8) as ad_upd,
            EMISSAO_FAVORECIDO.ad_usr,
            EMISSAO_FAVORECIDO.deletado
            from EMISSAO_FAVORECIDO
            where (EMISSAO_FAVORECIDO.deletado = 0 or EMISSAO_FAVORECIDO.deletado is null) and emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`;

            const resultadoFavorecido = await executeQuery(strsqlFavorecido);

            const strsqlTomador = `select 
            EMISSAO_TOMADOR.emissaoTomador_id,
            EMISSAO_TOMADOR.cliente_id,
            EMISSAO_TOMADOR.emissao_id,
            EMISSAO_TOMADOR.tomador_id,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_new, 8) as ad_new,
            CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO_TOMADOR.ad_upd, 8) as ad_upd,
            EMISSAO_TOMADOR.ad_usr,
            EMISSAO_TOMADOR.deletado
            from EMISSAO_TOMADOR
            inner join TOMADOR on EMISSAO_TOMADOR.tomador_id = TOMADOR.tomador_id
            where (EMISSAO_TOMADOR.deletado = 0 or EMISSAO_TOMADOR.deletado is null) and emissao_id = ${emissao_id} and cliente_id = ${cliente_id}`;
            
            const resultadoTomador = await executeQuery(strsqlTomador);

            
            //Pega as variáveis da emissão PRINCIPAL
            const pin = resultado[0].pin
            const dataEmissao = resultado[0].dataEmissao
            const dataInicio = resultado[0].dataInicio
            const dataVencimento = resultado[0].dataVencimento
            const dias = resultado[0].dias
            const dataVencimentoIndeterminado = resultado[0].dataVencimentoIndeterminado
            const valor = resultado[0].valor
            const valorExtenso = resultado[0].valorExtenso
            const modalidade_id = resultado[0].modalidade_id
            const modalidadeTexto = resultado[0].modalidadeTexto
            const objeto = resultado[0].objeto
            const textoFianca = resultado[0].textoFianca
            const documento = resultado[0].documento
            const sinistro = resultado[0].sinistro
            const bloqueada = resultado[0].bloqueada
            const taxa = resultado[0].taxa
            const premio = resultado[0].premio
            const pago = resultado[0].pago
            const valorPago = resultado[0].valorPago
            const minuta = resultado[0].minuta
            const garantia = resultado[0].garantia
            const ad_new = resultado[0].ad_new
            const ad_upd = resultado[0].ad_upd


        } else {
            response.status(201).json([{ status: 'erro' }]);
        }

    },

};