const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { executeQuery, formatToReais } = require('../services/generalFunctions');
const { listaEmissao } = require('./emissaoController');
const { listaEmissaoFavorecido } = require('./emissaoFavorecidoController');
const { listaEmissaoTomador } = require('./emissaoTomadorController');
const QRCode = require('qrcode');


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

            const fundoPath = path.resolve(__dirname, `../../public/${cliente_id}/fundo_garantia.jpg`);
            const fundoBase64 = fs.readFileSync(fundoPath, { encoding: 'base64' });
            const fundoMime = 'image/jpeg';
            const fundoUrl = `data:${fundoMime};base64,${fundoBase64}`;

            //QR code
            const qrUrl = `https://secure.garantik.com.br/${cliente_id}/${pin}.pdf`;
            const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);




            // Cria o HTML com os dados da emissão

            const htmlContent = `<!DOCTYPE html>
                                    <html>
                                    <head>
                                        <title>${pin}</title>
                                        <style>
                                        @page { margin: 0mm; }
                                        body {
                                            font-family: Arial, sans-serif;
                                            font-size: 9pt;
                                            background-image: url("${fundoUrl}");
                                            background-size: cover;
                                            background-repeat: no-repeat;
                                            margin: 0;
                                            padding: 0;
                                        }
                                        .container {
                                            margin: 14mm;
                                            background: transparent;
                                            padding: 14px;
                                        }
                                        .center { text-align: center; }
                                        .left { text-align: left; }
                                        .right { text-align: right; }
                                        .justify { text-align: justify; }
                                        .bold { font-weight: bold; }
                                        .section-title {
                                            background-color: #e7e7e7;
                                            text-align: center;
                                            font-size: 10pt;
                                            font-weight: bold;
                                            padding: 3px;
                                        }
                                        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                                        td { padding: 3px; vertical-align: top; }
                                        </style>
                                    </head>

                                    <body>
                                        <div class="container">
                                        <br><br><br><br><br><br><br><br>

                                        <div style="position: absolute; left: 25mm; top: 10mm;">
                                            <img src="${qrCodeDataUrl}" width="100" height="100" />
                                        </div>


                                        <div style="
                                            position: absolute;
                                            top: 25mm;
                                            right: 30mm;
                                            font-weight: bold;
                                            font-size: 14pt;
                                        ">
                                            PIN <br> ${pin}
                                        </div>

                                        <table>
                                            <tr>
                                            <td class="left bold">Data de emissão: ${dataEmissao}</td>
                                            <td class="right bold">Data de início: ${dataInicio}</td>
                                            </tr>
                                            <tr>
                                            <td></td>
                                            <td class="right bold">Data de vencimento: ${dataVencimento}</td>
                                            </tr>
                                        </table>

                                        ${emissaoFavorecido.map((fav) => `
                                            <table>
                                            <tr>
                                                <td class="left bold">FAVORECIDO/CREDOR:</td>
                                                <td class="left">${fav.nome}${fav.nomeFantasia}</td>
                                            </tr>
                                            <tr>
                                                <td class="left">${fav.tipo === 'F' ? 'CPF:' : 'CNPJ:'}</td>
                                                <td class="left">${fav.tipo === 'F' ? fav.cpf : fav.cnpj}</td>
                                            </tr>
                                            </table>
                                        `).join('')}

                                        <div class="section-title">VALOR ${simbolo} ${await formatToReais(valor)}</div>
                                        <div class="section-title">${valorExtenso}</div>

                                        <p class="justify">
                                            Declaração: <b>ALBAN FIANCAS E GARANTIAS S/A</b>, inscrita no CNPJ/MF sob o nº 05.402.543/0001-59, com sede à Avenida Paulista, 2073 - CONJ 1702 HORSA II, bairro Bela Vista, na cidade de São Paulo/Capital, abaixo assinados, declara assumir total responsabilidade como fiador, com amparo jurídico/legal e em conformidade com a Lei nº 10.406, de 10 de janeiro de 2002, Arts. 818 a 829, e em consonância com os objetivos sociais, da empresa
                                            ${emissaoTomador.map((tom) => `
                                            <b>${tom.nome}${tom.nomeFantasia}</b>, ${tom.tipo === 'F' ? 'CPF: ' + tom.cpf : 'CNPJ: ' + tom.cnpj}, estabelecida à <b>${tom.logradouro} - ${tom.complemento} - ${tom.bairro} - ${tom.ibge_descri} - ${tom.uf}</b>
                                            `).join('')}
                                            na qual figura como afiançado, até o limite máximo contratado, <b>R$ ${valor} - (${valorExtenso})</b>.
                                        </p>

                                        <p class="justify"><b>Objeto da Fiança:</b> ${objeto}</p>
                                        <p class="justify">${modalidadeTexto}</p>
                                        </div>
                                    </body>
                                    </html>`;

            console.log('htmlContent:' + htmlContent); // Adicione esta linha para verificar o valor da variável htmlContent antes de passar para o Puppeteer

            // Inicia o browser com Puppeteer
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
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
                    left: '80mm',
                    right: '80mm'
                }
            });

            await browser.close();

            // Define o diretório de destino e cria se não existir
            const dirPath = path.join(__dirname, `../../public/${cliente_id}`);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            console.log('dirPath:' + dirPath); // Adicione esta linha para verificar o valor da variável dirPath
            console.log('pin:' + pin); // Adicione esta linha para verificar o valor da variável dirPath
            console.log('cliente_id:' + cliente_id); // Adicione esta linha para verificar o valor da variável dirPath   

            // Define o caminho completo do arquivo PDF
            const filePath = path.join(dirPath, `${pin}.pdf`);

            // Salva o PDF no diretório
            fs.writeFileSync(filePath, pdfBuffer);

            return response.json({
                status: 'sucesso',
                descricao: 'PDF gerado e salvo com sucesso.',
                file: filePath
            });

        } else {
            return response.status(201).json([{ status: 'erro', descricao: 'Erro ao selecionar a emissão.' }]);
        }
    },

};
