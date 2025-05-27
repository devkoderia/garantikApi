const moment = require('moment-timezone');
const extenso = require('extenso');
const escapeString = require('sql-escape-string')
const {
    executeQuery,
    formatDate,
    formatNumber,
    formatString,
    formatBool
} = require('../services/generalFunctions');

const { listaTomador } = require('./tomadorController');
const { listaFavorecido } = require('./favorecidoController');

function montarValorExtenso(valor, moeda_id) {
    let tipoMoeda;

    switch (moeda_id) {
        case 18:
            tipoMoeda = 'BRL';
            break;
        case 42:
            tipoMoeda = 'EUR';
            break;
        case 160:
            tipoMoeda = 'USD';
            break;
        default:
            throw new Error(`Moeda não suportada: ${moeda_id}`);
    }

    console.log(valor, moeda_id)

    return extenso(valor, {
        mode: 'currency',
        currency: { type: tipoMoeda }
    }).toUpperCase();
}

async function montarPin(cliente_id) {
    const strsql = `SELECT pin FROM CLIENTE WHERE cliente_id = ${cliente_id}`;
    const resultado = await executeQuery(strsql);

    if (!resultado.length) {
        throw new Error(`Cliente ${cliente_id} não encontrado.`);
    }

    const basePin = resultado[0].pin;
    const ts = moment().format('YYYYMMDDHHmmss');
    return basePin + ts;
}

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
        })
    }

    return dataBack;

}



async function listaEmissaoTodos(cliente_id) {

    console.log(cliente_id)

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

module.exports = {

    async gravaGarantia(request, response) {

        const { emissao_id } = request.params;

        const strsql = `update EMISSAO set garantia = 1 where emissao_id = ${emissao_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async gravaMinuta(request, response) {

        const { emissao_id } = request.params;

        const strsql = `update EMISSAO set minuta = 1 where emissao_id = ${emissao_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async apagaGarantia(request, response) {

        const { emissao_id } = request.params;

        const strsql = `update EMISSAO set garantia = 0 where emissao_id = ${emissao_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },

    async apagaMinuta(request, response) {

        const { emissao_id } = request.params;

        const strsql = `update EMISSAO set minuta = 0 where emissao_id = ${emissao_id}`;
        const resultado = await executeQuery(strsql);
        response.status(200).send(resultado);
    },



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
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { emissao_id } = request.params;

        const resultado = await listaEmissaoUm(emissao_id)

        response.status(200).send(resultado);

    },


    async listaTodos(request, response) {

        const { cliente_id } = request.params;

        console.log('cliente_id: ' + cliente_id)

        const resultado = await listaEmissaoTodos(cliente_id)

        response.status(200).send(resultado);
    },


    async create(request, response) {

        const {
            cliente_id,
            dataEmissao,
            dataInicio,
            dataVencimento,
            dias,
            dataVencimentoIndeterminado,
            moeda_id,
            valor,
            objeto,
            modalidade_id,
            modalidadeTexto,
            taxa,
            premio,
            pago,
            valorPago,
            trabalhista,
            fiscal,
            multa,
            textoTrabalhista,
            textoFiscal,
            textoMulta,
            ad_usr,
            observacoesCorretor,
            observacoesSubscritor,
            valorComissao,
            percentualComissao,
            valorSpread,
            favorecidos,
            tomadores,
        } = request.body;


        const ad_new = moment().format('YYYY-MM-DD HH:mm:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        const valorExtenso = await montarValorExtenso(valor, moeda_id)
        const pin = await montarPin(cliente_id)

        const strsql = `INSERT INTO EMISSAO (
                    cliente_id,
                    pin,
                    dataEmissao,
                    dataInicio,
                    dataVencimento,
                    dias,
                    dataVencimentoIndeterminado,
                    moeda_id,
                    valor,
                    valorExtenso,
                    objeto,
                    modalidade_id,
                    modalidadeTexto,
                    taxa,
                    premio,
                    pago,
                    valorPago,
                    trabalhista,
                    fiscal,
                    multa,
                    textoTrabalhista,
                    textoFiscal,
                    textoMulta,
                    ad_new,
                    ad_upd,
                    ad_usr,
                    deletado,
                    observacoesCorretor,
                    observacoesSubscritor,
                    valorComissao,
                    percentualComissao,
                    valorSpread
                ) output inserted.emissao_id VALUES (
                    ${cliente_id},
                    '${pin}',
                    ${formatDate(dataEmissao)},
                    ${formatDate(dataInicio)},
                    ${formatDate(dataVencimento)},
                    ${dias != null && dias !== '' ? dias : 'NULL'},
                    ${formatBool(dataVencimentoIndeterminado)},
                    ${typeof moeda_id === 'number' ? moeda_id : 'NULL'},
                    ${formatNumber(valor)},
                    '${valorExtenso}',
                    ${formatString(objeto)},
                    ${typeof modalidade_id === 'number' ? modalidade_id : 'NULL'},
                    ${formatString(modalidadeTexto)},
                    ${formatNumber(taxa)},
                    ${formatNumber(premio)},
                    ${formatBool(pago)},
                    ${formatNumber(valorPago)},
                    ${formatBool(trabalhista)},
                    ${formatBool(fiscal)},
                    ${formatBool(multa)},
                    ${formatString(textoTrabalhista)},
                    ${formatString(textoFiscal)},
                    ${formatString(textoMulta)},
                    '${ad_new}',
                    '${ad_upd}',
                    ${ad_usr},
                    ${deletado},
                    ${formatString(observacoesCorretor)},
                    ${formatString(observacoesSubscritor)},
                    ${formatNumber(valorComissao)},
                    ${formatNumber(percentualComissao)},
                    ${formatNumber(valorSpread)}
                )`;

        //console.log(strsql)

        const resultado = await executeQuery(strsql);
        const emissao_id = resultado[0].emissao_id;

        for (const favorecido_id of favorecidos) {
            const insertFav = `INSERT INTO EMISSAO_FAVORECIDO (
                    cliente_id,
                    emissao_id,
                    favorecido_id,
                    ad_new,
                    ad_upd,
                    ad_usr,
                    deletado
                ) VALUES (
                    ${cliente_id},
                    ${emissao_id},
                    ${favorecido_id},
                    '${ad_new}',
                    '${ad_upd}',
                    ${ad_usr},
                    ${deletado}
                )`;

            await executeQuery(insertFav);
        }

        // 3. Insere os tomadores
        for (const tomador_id of tomadores) {
            const insertTom = `INSERT INTO EMISSAO_TOMADOR (
                cliente_id,
                emissao_id,
                tomador_id,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) VALUES (
                ${cliente_id},
                ${emissao_id},
                ${tomador_id},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
            await executeQuery(insertTom);
        }

        response.status(200).json({ status: 'ok' });

    },

    async update(request, response) {

        const { emissao_id } = request.params;

        const {
            cliente_id,
            dataEmissao,
            dataInicio,
            dataVencimento,
            dias,
            dataVencimentoIndeterminado,
            moeda_id,
            valor,
            objeto,
            modalidade_id,
            modalidadeTexto,
            taxa,
            premio,
            pago,
            valorPago,
            trabalhista,
            fiscal,
            multa,
            textoTrabalhista,
            textoFiscal,
            textoMulta,
            ad_usr,
            observacoesCorretor,
            observacoesSubscritor,
            valorComissao,
            percentualComissao,
            valorSpread,
            favorecidos,
            tomadores,
        } = request.body;

        const ad_upd = moment().format('YYYY-MM-DD HH:mm:ss');

        const valorExtenso = await montarValorExtenso(valor, moeda_id);

        const strsqlUpdate = `UPDATE EMISSAO SET
            dataEmissao = ${formatDate(dataEmissao)},
            dataInicio = ${formatDate(dataInicio)},
            dataVencimento = ${formatDate(dataVencimento)},
            dias = ${dias != null && dias !== '' ? dias : 'NULL'},
            dataVencimentoIndeterminado = ${formatBool(dataVencimentoIndeterminado)},
            moeda_id = ${typeof moeda_id === 'number' ? moeda_id : 'NULL'},
            valor = ${formatNumber(valor)},
            valorExtenso = '${valorExtenso}',
            objeto = ${formatString(objeto)},
            modalidade_id = ${typeof modalidade_id === 'number' ? modalidade_id : 'NULL'},
            modalidadeTexto = ${formatString(modalidadeTexto)},
            taxa = ${formatNumber(taxa)},
            premio = ${formatNumber(premio)},
            pago = ${formatBool(pago)},
            valorPago = ${formatNumber(valorPago)},
            trabalhista = ${formatBool(trabalhista)},
            fiscal = ${formatBool(fiscal)},
            multa = ${formatBool(multa)},
            textoTrabalhista = ${formatString(textoTrabalhista)},
            textoFiscal = ${formatString(textoFiscal)},
            textoMulta = ${formatString(textoMulta)},
            ad_upd = '${ad_upd}',
            ad_usr = ${ad_usr},
            observacoesCorretor = ${formatString(observacoesCorretor)},
            observacoesSubscritor = ${formatString(observacoesSubscritor)},
            valorComissao = ${formatNumber(valorComissao)},
            percentualComissao = ${formatNumber(percentualComissao)},
            valorSpread = ${formatNumber(valorSpread)}
        WHERE emissao_id = ${emissao_id}`;

        await executeQuery(strsqlUpdate);

        // Remove registros antigos de favorecidos e tomadores
        await executeQuery(`update EMISSAO_FAVORECIDO set deletado = 1 where emissao_id = ${emissao_id}`);
        await executeQuery(`update EMISSAO_TOMADOR set deletado = 1 where emissao_id = ${emissao_id}`);

        // Reinsere favorecidos
        for (const favorecido_id of favorecidos) {
            const insertFav = `INSERT INTO EMISSAO_FAVORECIDO (
            cliente_id,
            emissao_id,
            favorecido_id,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${emissao_id},
            ${favorecido_id},
            '${ad_upd}',
            '${ad_upd}',
            ${ad_usr},
            0
        )`;
            await executeQuery(insertFav);
        }

        // Reinsere tomadores
        for (const tomador_id of tomadores) {
            const insertTom = `INSERT INTO EMISSAO_TOMADOR (
            cliente_id,
            emissao_id,
            tomador_id,
            ad_new,
            ad_upd,
            ad_usr,
            deletado
        ) VALUES (
            ${cliente_id},
            ${emissao_id},
            ${tomador_id},
            '${ad_upd}',
            '${ad_upd}',
            ${ad_usr},
            0
        )`;
            await executeQuery(insertTom);
        }

        response.status(200).json({ status: 'ok' });
    },

    listaEmissaoUm

};