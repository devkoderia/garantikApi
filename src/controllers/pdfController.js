const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { executeQuery, formatToReais } = require('../services/generalFunctions');
const { listaEmissao } = require('./emissaoController');
const { listaEmissaoFavorecido } = require('./emissaoFavorecidoController');
const { listaEmissaoTomador } = require('./emissaoTomadorController');

module.exports = {

    async index(request, response) {

        const { emissao_id } = request.params;
        const { cliente_id } = request.body;

        const emissao = await listaEmissao(emissao_id, cliente_id);

        if (emissao.length > 0) {

            const emissaoFavorecido = await listaEmissaoFavorecido(emissao_id, cliente_id);
            const emissaoTomador = await listaEmissaoTomador(emissao_id, cliente_id);

            // Pega as variáveis da emissão PRINCIPAL
            const pin = emissao[0].pin;
            const dataEmissao = emissao[0].dataEmissao;
            const dataInicio = emissao[0].dataInicio;
            const dataVencimento = emissao[0].dataVencimento;
            const dias = emissao[0].dias;
            const dataVencimentoIndeterminado = emissao[0].dataVencimentoIndeterminado;
            const valor = emissao[0].valor;
            const valorExtenso = emissao[0].valorExtenso;
            const modalidade_id = emissao[0].modalidade_id;
            const modalidadeTexto = emissao[0].modalidadeTexto;
            const objeto = emissao[0].objeto;
            const textoFianca = emissao[0].textoFianca;
            const documento = emissao[0].documento;
            const sinistro = emissao[0].sinistro;
            const bloqueada = emissao[0].bloqueada;
            const taxa = emissao[0].taxa;
            const premio = emissao[0].premio;
            const pago = emissao[0].pago;
            const valorPago = emissao[0].valorPago;
            const minuta = emissao[0].minuta;
            const garantia = emissao[0].garantia;
            const ad_new = emissao[0].ad_new;
            const ad_upd = emissao[0].ad_upd;
            const simbolo = emissao[0].simbolo;

            const fundoPath = `https://cdn.garantik.com.br/${cliente_id}/fundo_garantia.jpg`;

            console.log(`fundoPath: ${fundoPath}`);

            const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        @page { margin: 0mm; }
                        body {
                            font-family: Arial, sans-serif;
                            background-image: url("${fundoPath}");
                            background-size: cover;
                            background-repeat: no-repeat;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            margin: 5mm;
                            background: rgba(255, 255, 255, 0.9);
                            padding: 5px;
                        }
                        h1, h2 { text-align: center; }
                        ul { list-style-type: none; padding: 0; }
                        li { margin-bottom: 5px; }
                    </style>
                </head>

                <body>

                    <br><br><br><br>
                    <br><br><br><br>

                    <table border="0" width="774" align="center">
                        <tr>
                        <td>
                        <center><font size="3" color="black" face="verdana,arial,helvetica">
                        <b>Carta de Fiança n. ${pin}</b>
                        </td>
                        </tr>
                    </table>
                    <br><br>
                    <table border="0" width="774" align="center">
                        <tr>
                        <td align="left"><font size="3" color="black" face="verdana,arial,helvetica">
                        <b>Data de emissão: ${dataEmissao}</b>
                        </td>
                        <td align="right"><font size="3" color="black" face="verdana,arial,helvetica">
                        <b>Data de início: ${dataInicio}</b>
                        </td>
                        </tr>
                        <tr>
                        <td align="left"><font size="3" color="black" face="verdana,arial,helvetica">
                        
                        </td>
                        <td align="right"><font size="3" color="black" face="verdana,arial,helvetica">
                        <b>Data de vencimento: ${dataVencimento}</b>
                        </td>
                        </tr>
                    </table>
                    <br>
                    <table border="0" width="774" align="center">

                        ${emissaoFavorecido.map((fav) => {

                            console.log(fav.nomeFantasia)

                            return `<tr>
                                        <td align="left">
                                        <font size="3" color="black" face="verdana,arial,helvetica">
                                            <b>FAVORECIDO/CREDOR: </b>${fav.nome}${fav.nomeFantasia}
                                        </font>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left">
                                        <font size="3" color="black" face="verdana,arial,helvetica">
                                            ${fav.tipo == 'F' ? '<b>CPF: </b>' + fav.cpf : '<b>CNPJ: </b>' + fav.cnpj}
                                        </font>
                                        </td>
                                    </tr>`;
                        }).join('')}

                        
                    </table>
                    
                    <table border="0" width="774" align="center">
                        <tr>
                            <td align="center" bgcolor="8db0db"><font size="4" color="black" face="verdana,arial,helvetica">
                                <b>VALOR ${simbolo} ${await formatToReais(valor)}</b>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="8db0db"><font size="4" color="black" face="verdana,arial,helvetica">
                                <b>${valorExtenso}</b>
                            </td>
                        </tr>
                    </table>
                    
                    <table border="0" width="774" align="center">
                        <tr>
                            <td class="main"><font size="2" color="black" face="verdana,arial,helvetica">
                            <p style="text-align: justify;"> Declaração: <b>ALBAN FIANCAS E GARANTIAS S/A</b>, inscrita no CNPJ/MF sob o nº 05.402.543/0001-59, com sede à Avenida Paulista, 2073 - CONJ 1702 HORSA II, bairro Bela Vista, na cidade de São Paulo/Capital, abaixo assinados, declara assumir total responsabilidade como fiador, com amparo jurídico/legal 
                            e em conformidade com a Lei nº 10.406, de 10 de janeiro de 2002, Arts. 818 a 829, e em consonância com os objetivos sociais, da empresa 
                            
                                ${emissaoTomador.map((tom) => {
                                    return `<b>${tom.nome}${tom.nomeFantasia}, 
                                            ${tom.tipo == 'F' ? '<b>CPF: </b>' + tom.cpf : '<b>CNPJ: </b>' + tom.cnpj}</b>
                                            </b>estabelecida à <b>${tom.logradouro} - ${tom.complemento} - ${tom.bairro} - ${tom.ibge_descri} - ${tom.uf}</b>, `;
                                }).join('')}
                            
                            na qual figura como afiançado, até o limite máximo contratado, <b>R$ ${valor} - (${valorExtenso}).</b></p>
                            </td>
                        </tr>
                    </table>

                    <table border="0" width="774" align="center">
                        <tr>
                            <td><font size="2" color="black" face="verdana,arial,helvetica">
                                <p class="main" class="main" style="text-align: justify;"><b>Objeto da Fiança: ${objeto}</b></p>
                            </td>
                        </tr>
                    </table>
                    
                    <table border="0" width="774" align="center">
                        <tr>
                            <td>
                                <font size="2" color="black" face="verdana,arial,helvetica">
                                <p class="main" style="text-align: justify;">${modalidadeTexto}</p>
                            </td>
                        </tr>
                    </table>

                    </body>

                </div>
            </html>
          `;

            try {
                // Inicia o browser com Puppeteer
                const browser = await puppeteer.launch({
                    executablePath: '/snap/bin/chromium',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage'
                    ]
                });
                const page = await browser.newPage();

                // Define o conteúdo da página com o HTML acima
                await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

                // Gera o PDF
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '40mm',
                        bottom: '40mm',
                        left: '40mm',
                        right: '40mm'
                    }
                });

                await browser.close();

                // Define o diretório de destino e cria se não existir
                const dirPath = path.join(__dirname, `../../public/${cliente_id}`);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                // Define o caminho completo do arquivo PDF
                const filePath = path.join(dirPath, `${pin}.pdf`);

                // Salva o PDF no diretório
                fs.writeFileSync(filePath, pdfBuffer);

                return response.json({
                    status: 'sucesso',
                    descricao: 'PDF gerado e salvo com sucesso.',
                    file: filePath
                });

            } catch (err) {
                console.error('Erro ao gerar PDF:', err);
                return response.status(500).json([{ status: 'erro', descricao: 'Erro ao gerar o PDF.' }]);
            }

        } else {
            return response.status(201).json([{ status: 'erro', descricao: 'Erro ao selecionar a emissão.' }]);
        }
    },

};
