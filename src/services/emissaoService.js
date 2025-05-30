const { executeQuery } = require('./generalFunctions');
const { listaTomador } = require('../controllers/tomadorController');
const { listaFavorecido } = require('../controllers/favorecidoController');

async function listaEmissaoUm(emissao_id) {
    const strsql = `select 
        EMISSAO.emissao_id,
        EMISSAO.cliente_id,
        EMISSAO.pin,
        CONVERT(VARCHAR, EMISSAO.dataEmissao, 103) AS dataEmissao,
        CONVERT(VARCHAR, EMISSAO.dataInicio, 103) AS dataInicio,
        ISNULL(CONVERT(VARCHAR, EMISSAO.dataVencimento, 103), '') AS dataVencimento,
        EMISSAO.dias,
        EMISSAO.dataVencimentoIndeterminado,
        EMISSAO.moeda_id,
        EMISSAO.valor,
        EMISSAO.valorExtenso,
        EMISSAO.objeto,
        EMISSAO.modalidade_id,
        EMISSAO.modalidadeTexto,
        EMISSAO.sinistro,
        EMISSAO.bloqueada,
        EMISSAO.taxa,
        EMISSAO.premio,
        EMISSAO.pago,
        EMISSAO.valorPago,
        EMISSAO.minuta,
        EMISSAO.garantia,
        EMISSAO.trabalhista,
        EMISSAO.fiscal,
        EMISSAO.textoTrabalhista,
        EMISSAO.textoFiscal,
        EMISSAO.observacoesCorretor,
        EMISSAO.observacoesSubscritor,
        EMISSAO.valorComissao,
        EMISSAO.percentualComissao,
        EMISSAO.valorSpread,
        CONVERT(VARCHAR, EMISSAO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_new, 8) AS ad_new,
        CONVERT(VARCHAR, EMISSAO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_upd, 8) AS ad_upd,
        EMISSAO.ad_usr,
        EMISSAO.deletado,
        MOEDA.descricao,
        MOEDA.descricaoExtenso,
        MOEDA.descricaoExtensoDecimal,
        MOEDA.simbolo
        from EMISSAO
        inner join MOEDA on MOEDA.moeda_id = EMISSAO.moeda_id
        where (EMISSAO.deletado = 0 or EMISSAO.deletado is null) and 
        EMISSAO.emissao_id = ${emissao_id} and MOEDA.ativo = 1`;

    const resultado = await executeQuery(strsql);

    const dataBack = []

    for (const rs of resultado) {
        dataBack.push({
            emissao_id: rs.emissao_id,
            cliente_id: rs.cliente_id,
            pin: rs.pin,
            dataEmissao: rs.dataEmissao,
            dataInicio: rs.dataInicio,
            dataVencimento: rs.dataVencimento,
            dias: rs.dias,
            dataVencimentoIndeterminado: rs.dataVencimentoIndeterminado,
            moeda_id: rs.moeda_id,
            valor: rs.valor,
            valorExtenso: rs.valorExtenso,
            objeto: rs.objeto,
            modalidade_id: rs.modalidade_id,
            modalidadeTexto: rs.modalidadeTexto,
            sinistro: rs.sinistro,
            bloqueada: rs.bloqueada,
            taxa: rs.taxa,
            premio: rs.premio,
            pago: rs.pago,
            valorPago: rs.valorPago,
            minuta: rs.minuta,
            garantia: rs.garantia,
            trabalhista: rs.trabalhista,
            fiscal: rs.fiscal,
            textoTrabalhista: rs.textoTrabalhista,
            textoFiscal: rs.textoFiscal,
            observacoesCorretor: rs.observacoesCorretor,
            observacoesSubscritor: rs.observacoesSubscritor,
            valorComissao: rs.valorComissao,
            percentualComissao: rs.percentualComissao,
            valorSpread: rs.valorSpread,
            tomadores: await listaTomador(emissao_id),
            favorecidos: await listaFavorecido(emissao_id),
        });
    }

    return dataBack;
}


async function listaEmissaoTodos(cliente_id) {

    const strsql = `select distinct
        EMISSAO.emissao_id,
        EMISSAO.cliente_id,
        EMISSAO.pin,
        CONVERT(VARCHAR, EMISSAO.dataEmissao, 103) AS dataEmissao,
        ISNULL(CONVERT(VARCHAR, EMISSAO.dataVencimento, 103), '') AS dataVencimento,
        -- Formatação condicional do valor
        CASE 
            WHEN MOEDA.descricao = 'Real' THEN MOEDA.simbolo + ' ' + FORMAT(EMISSAO.valor, 'N2', 'pt-BR')
            WHEN MOEDA.descricao = 'Euro' THEN  MOEDA.simbolo + ' ' + FORMAT(EMISSAO.valor, 'N2', 'pt-BR')
            WHEN MOEDA.descricao = 'Dólar dos Estados Unidos' THEN  MOEDA.simbolo + ' ' + FORMAT(EMISSAO.valor, 'N2', 'en-US')
            ELSE FORMAT(EMISSAO.valor, 'N2')
        END AS valorFormatado,
        MODALIDADE.descricao AS modalidadeDescricao
        FROM EMISSAO
        INNER JOIN MODALIDADE ON MODALIDADE.modalidade_id = EMISSAO.modalidade_id
        INNER JOIN MOEDA ON MOEDA.moeda_id = EMISSAO.moeda_id
        WHERE 
            (EMISSAO.deletado = 0 OR EMISSAO.deletado IS NULL) 
            AND MOEDA.ativo = 1 
            AND EMISSAO.cliente_id = ${cliente_id}`;

    const resultado = await executeQuery(strsql);

    var dataBack = []

    for (let i = 0; i < resultado.length; i++) {

        var rs = resultado[i];

        dataBack.push({

            emissao_id: rs.emissao_id,
            cliente_id: rs.cliente_id,
            pin: rs.pin,
            dataEmissao: rs.dataEmissao,
            dataInicio: rs.dataInicio,
            dataVencimento: rs.dataVencimento,
            valor: rs.valorFormatado,
            modalidadeDescricao: rs.modalidadeDescricao,
            moeda_id: rs.moeda_id,
            tomadores: await listaTomador(rs.emissao_id),
            favorecidos: await listaFavorecido(rs.emissao_id),
        })
    }

    return dataBack;

}

module.exports = { listaEmissaoUm, listaEmissaoTodos };
