const moment = require('moment-timezone');
const extenso = require('extenso');
const {
    executeQuery,
    formatDate,
    formatNumber,
    formatString,
    formatBool
} = require('../services/generalFunctions');

const { listaEmissaoUm, listaEmissaoTodos } = require('../services/emissaoService');
const { pdfGera } = require('./pdfController');

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

module.exports = {

    async gravaGarantia(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO set garantia = 1 where emissao_id = ${emissao_id}`;
        await executeQuery(strsql);
        await pdfGera(emissao_id, cliente_id, 'G')

        response.status(200).send({ status: 'ok'});
    },

    async gravaMinuta(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO set minuta = 1 where emissao_id = ${emissao_id}`;
        await executeQuery(strsql);
        await pdfGera(emissao_id, cliente_id, 'M')

        response.status(200).send({ status: 'ok'});
    },

    async apagaGarantia(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO set garantia = 0 where emissao_id = ${emissao_id}`;
        await executeQuery(strsql);
        response.status(200).send({ status: 'ok'});
    },

    async apagaMinuta(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const strsql = `update EMISSAO set minuta = 0 where emissao_id = ${emissao_id}`;
        await executeQuery(strsql);
        response.status(200).send({ status: 'ok'});
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

        response.status(200).json({ status: 'ok', emissao_id: emissao_id });

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

};