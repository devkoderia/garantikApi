const sql = require('mssql');
const connection = require('../database/connection');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Cria a conexão com o MSSQL
const poolPromise = new sql.ConnectionPool(connection)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

const executeQuery = async (strsql) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(strsql);
        return result.recordset;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// Configuração do transporter do Nodemailer.
// As configurações podem ser definidas via variáveis de ambiente.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'br246.hostgator.com.br',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
    auth: {
        user: process.env.SMTP_USER || 'naoresponda@garantik.com.br',
        pass: process.env.SMTP_PASS || '!nf0$@ud#2',
    },
});

// Chave secreta para geração do token (idealmente via variável de ambiente)
const secretKey = process.env.JWT_SECRET

// Função para envio de e-mails com conteúdo HTML
const sendEmail = async (usuario_id, tipo) => {
    try {
        // Consulta para obter os dados do usuário (nome e e-mail)
        const strsql = `
            SELECT email, nome 
            FROM USUARIO 
            WHERE usuario_id = ${usuario_id} 
              AND (deletado = 0 OR deletado IS NULL)
        `;
        const result = await executeQuery(strsql);

        if (!result || result.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        
        const { email, nome } = result[0];

        // Define assunto e corpo do e-mail com base no tipo
        let subject = '';
        let html = '';

        if (tipo === 'senha') {
            // Gera um token JWT contendo o usuario_id, com validade de 1 hora
            const token = jwt.sign({ usuario_id: usuario_id }, secretKey, { expiresIn: '1h' });
            subject = 'Garantik - Recuperação de Senha';
            html = `
                <p>Olá ${nome},</p>
                <p>Para recuperar sua senha, por favor clique no link abaixo:</p>
                <p><a href="https://web.garantik.com.br/recuperarSenha/${token}" target="_blank">Recuperar Senha</a></p>
                <p>Atenciosamente,<br/>Equipe Garantik.</p>
            `;
        } else {
            subject = 'Notificação';
            html = `
                <p>Olá ${nome},</p>
                <p>Esta é uma mensagem de notificação.</p>
                <p>Atenciosamente,<br/>Equipe Garantik.</p>
            `;
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || 'naoresponda@garantik.com.br',
            to: email,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ' + info.response);
        return { success: true, info };

    } catch (error) {

        console.error('Erro ao enviar e-mail:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { executeQuery, sendEmail };
