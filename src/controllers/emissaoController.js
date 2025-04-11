const moment = require('moment-timezone');
const escapeString = require('sql-escape-string')
const { executeQuery } = require('../services/generalFunctions');

module.exports = {

    async listaEmissao(emissao_id, cliente_id) {

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
            EMISSAO.emissao_id = ${emissao_id} and 
            EMISSAO.cliente_id = ${cliente_id} and 
            MOEDA.ativo = 1`;

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
        response.status(200).json({ status: 'ok' });
    },

    async listaUm(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const resultado = await listaEmissao(emissao_id, cliente_id)

        response.status(200).send(resultado);

    },


    async listaTodos(request, response) {

        const { cliente_id } = request.body;
    
        const strsql = `SELECT 
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
                CONVERT(VARCHAR, EMISSAO.ad_new, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_new, 8) AS ad_new,
                CONVERT(VARCHAR, EMISSAO.ad_upd, 103) + ' ' + CONVERT(VARCHAR, EMISSAO.ad_upd, 8) AS ad_upd,
                EMISSAO.ad_usr,
                EMISSAO.deletado
            FROM EMISSAO
            WHERE (EMISSAO.deletado = 0 OR EMISSAO.deletado IS NULL)
              AND EMISSAO.cliente_id = ${cliente_id}`;
    
        const resultado = await executeQuery(strsql);
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
            minuta,
            garantia,
            trabalhista,
            fiscal,
            textoTrabalhista,
            textoFiscal,
            ad_usr
        } = request.body;
    
        const ad_new = moment().format('YYYY-MM-DD HH:mm:ss');
        const ad_upd = ad_new;
        const deletado = 0;

        var valorExtenso = '';
        var pin = '';
    
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
                minuta,
                garantia,
                trabalhista,
                fiscal,
                textoTrabalhista,
                textoFiscal,
                ad_new,
                ad_upd,
                ad_usr,
                deletado
            ) VALUES (
                ${cliente_id},
                '${pin}',
                ${dataEmissao ? `'${moment(dataEmissao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                ${dataInicio ? `'${moment(dataInicio).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                ${dataVencimento ? `'${moment(dataVencimento).utc().format('YYYY-MM-DD')}'` : 'NULL'},
                ${dias != '' && dias != null ? `'${dias}'` : 'NULL'},
                ${dataVencimentoIndeterminado == true ? 1 : dataVencimentoIndeterminado == false ? 0 : 'NULL'},
                ${typeof moeda_id == 'number' ? moeda_id : 'NULL'},
                ${valor ? valor.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                '${valorExtenso}',
                ${objeto != '' && objeto != null ? `'${escapeString(objeto)}'` : 'NULL'},
                ${typeof modalidade_id == 'number' ? modalidade_id : 'NULL'},
                ${modalidadeTexto != '' && modalidadeTexto != null ? `'${escapeString(modalidadeTexto)}'` : 'NULL'},
                ${taxa ? taxa.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                ${premio ? premio.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                ${pago == true ? 1 : pago == false ? 0 : 'NULL'},
                ${valorPago ? valorPago.toString().replaceAll('.', '').replaceAll(',', '.') : null},
                ${minuta == true ? 1 : minuta == false ? 0 : 'NULL'},
                ${garantia == true ? 1 : garantia == false ? 0 : 'NULL'},
                ${trabalhista == true ? 1 : trabalhista == false ? 0 : 'NULL'},
                ${fiscal == true ? 1 : fiscal == false ? 0 : 'NULL'},
                ${textoTrabalhista != '' && textoTrabalhista != null ? `'${escapeString(textoTrabalhista)}'` : 'NULL'},
                ${textoFiscal != '' && textoFiscal != null ? `'${escapeString(textoFiscal)}'` : 'NULL'},
                '${ad_new}',
                '${ad_upd}',
                ${ad_usr},
                ${deletado}
            )`;
    
        await executeQuery(strsql);
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
            sinistro,
            bloqueada,
            taxa,
            premio,
            pago,
            valorPago,
            minuta,
            garantia,
            trabalhista,
            fiscal,
            textoTrabalhista,
            textoFiscal,
            ad_usr
        } = request.body;

        var valorExtenso = '';
        var pin = '';
    
        const ad_upd = moment().format('YYYY-MM-DD HH:mm:ss');
    
        const strsql = `UPDATE EMISSAO SET 
        pin = '${pin}',
        dataEmissao = ${dataEmissao ? `'${moment(dataEmissao).utc().format('YYYY-MM-DD')}'` : 'NULL'},
        dataInicio = ${dataInicio ? `'${moment(dataInicio).utc().format('YYYY-MM-DD')}'` : 'NULL'},
        dataVencimento = ${dataVencimento ? `'${moment(dataVencimento).utc().format('YYYY-MM-DD')}'` : 'NULL'},
        dias = ${dias != '' && dias != null ? `'${dias}'` : 'NULL'},
        dataVencimentoIndeterminado = ${dataVencimentoIndeterminado == true ? 1 : dataVencimentoIndeterminado == false ? 0 : 'NULL'},
        typeof = ${typeof moeda_id == 'number' ? moeda_id : 'NULL'},
        valor = ${valor ? valor.toString().replaceAll('.', '').replaceAll(',', '.') : null},
        valorExtenso = '${valorExtenso}',
        objeto = ${objeto != '' && objeto != null ? `'${escapeString(objeto)}'` : 'NULL'},
        typeof = ${typeof modalidade_id == 'number' ? modalidade_id : 'NULL'},
        modalidadeTexto = ${modalidadeTexto != '' && modalidadeTexto != null ? `'${escapeString(modalidadeTexto)}'` : 'NULL'},
        taxa = ${taxa ? taxa.toString().replaceAll('.', '').replaceAll(',', '.') : null},
        premio = ${premio ? premio.toString().replaceAll('.', '').replaceAll(',', '.') : null},
        pago = ${pago == true ? 1 : pago == false ? 0 : 'NULL'},
        valorPago = ${valorPago ? valorPago.toString().replaceAll('.', '').replaceAll(',', '.') : null},
        minuta = ${minuta == true ? 1 : minuta == false ? 0 : 'NULL'},
        garantia = ${garantia == true ? 1 : garantia == false ? 0 : 'NULL'},
        trabalhista = ${trabalhista == true ? 1 : trabalhista == false ? 0 : 'NULL'},
        fiscal = ${fiscal == true ? 1 : fiscal == false ? 0 : 'NULL'},
        sinistro = ${sinistro == true ? 1 : sinistro == false ? 0 : 'NULL'},
        bloqueada = ${bloqueada == true ? 1 : bloqueada == false ? 0 : 'NULL'},
        textoTrabalhista = ${textoTrabalhista != '' && textoTrabalhista != null ? `'${escapeString(textoTrabalhista)}'` : 'NULL'},
        textoFiscal = ${textoFiscal != '' && textoFiscal != null ? `'${escapeString(textoFiscal)}'` : 'NULL'},
        ad_upd = '${ad_upd}',
        ad_usr = ${ad_usr}
        WHERE emissao_id = ${emissao_id} AND cliente_id = ${cliente_id}`;
    
        await executeQuery(strsql);
        response.status(200).json({ status: 'ok' });
    }
    
};