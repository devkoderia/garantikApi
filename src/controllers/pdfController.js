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
        const { cliente_id, tipo } = request.body;

        const emissao = await listaEmissao(emissao_id, cliente_id);


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
        const htmlPdf = emissao[0].htmlPdf;

        const fundoPath = path.resolve(__dirname, `../../public/${cliente_id}/fundo_garantia.jpg`);
        const fundoBase64 = fs.readFileSync(fundoPath, { encoding: 'base64' });
        const fundoMime = 'image/jpeg';
        const fundoUrl = `data:${fundoMime};base64,${fundoBase64}`;

        //QR code
        const qrUrl = `https://secure.garantik.com.br/${cliente_id}/${pin}.pdf`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);




        // Cria o HTML com os dados da emissão

        const htmlContent = htmlPdf
            

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


    },

};
