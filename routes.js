const express = require('express')
const routes = express.Router()
const { celebrate, Joi, Segments } = require('celebrate')


function verificaToken(request, response, next) {

    const key = process.env.KEY_GARANTI
    var token = request.headers['x-access-token']

    if (token != key) {

        response.status(401).json([{ alerta: 'erro', mensagem: 'token inválido!' }])
        return false

    } else {

        next()

    }
}

routes.get('/', function (_, res) {
    res.render('index', {
        title: "API GarantiK",
        version: "0.0.2"
    })
})


//SERVIÇOS EXTERNOS
//-------------------------------------------------------------------------------------------------------------

const consultaCNPJService = require('./src/services/consultaCNPJService')

routes.get('/consultaCNPJ/:cnpj', celebrate({

    [Segments.PARAMS]: Joi.object().keys({

        cnpj: Joi.string().required().max(14),

    })

}), verificaToken, consultaCNPJService.consultaCNPJ)



//AUTO CADASTRO
//-------------------------------------------------------------------------------------------------------------
const autoCadastroController = require('./src/controllers/autoCadastroController')

routes.post('/autoCadastro', celebrate({
    [Segments.BODY]: Joi.object().keys({
        convite_id: Joi.number().integer().required(),
        cliente_id: Joi.number().integer().required(),
        cpf: Joi.string().required().length(11),
        nome: Joi.string().required().max(150),
        email: Joi.string().required().max(150),
        senha: Joi.string().required().max(50),
        telefone: Joi.string().required().max(50),
    })
}), verificaToken, autoCadastroController.index)


//CONVITE
//-------------------------------------------------------------------------------------------------------------
const conviteController = require('./src/controllers/conviteController')

routes.post('/convite', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        email: Joi.string().required(),
        nome: Joi.string().required(),
        nomeFantasia: Joi.string().required(),
        ad_usr: Joi.number().integer().required(),
    })
}), conviteController.create)

routes.post('/conviteValida', verificaToken, celebrate({

    [Segments.BODY]: Joi.object().keys({

        cliente_id: Joi.number().integer().required(),
        chaveLink: Joi.string().max(32).required(),

    })

}), conviteController.valida)


//ACESSO
//-------------------------------------------------------------------------------------------------------------
const acessoController = require('./src/controllers/acessoController')

routes.post('/acessoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), acessoController.count)

routes.post('/acessoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), acessoController.listaTodos)

routes.post('/acessoListaUm/:acesso_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        acesso_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, acessoController.listaUm)

routes.post('/acesso', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        usuario_id: Joi.number().integer().allow(null, ''),
        cpf: Joi.string().allow(null, '').length(11),
        tipoJuridico: Joi.string().required().max(50),
        ip: Joi.string().allow(null, '').max(150),
        senha: Joi.string().allow(null, '').max(150),
    })
}), verificaToken, acessoController.create)

routes.delete('/acesso/:acesso_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        acesso_id: Joi.number().integer().required()
    }),
}), verificaToken, acessoController.destroy)


//AVALISTA
//-------------------------------------------------------------------------------------------------------------
const avalistaController = require('./src/controllers/avalistaController')

routes.post('/avalistaConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), avalistaController.count)

routes.post('/avalistaListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), avalistaController.listaTodos)

routes.post('/avalistaListaUm/:avalista_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalista_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, avalistaController.listaUm)

routes.post('/avalista', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        outroDocumento: Joi.string().allow(null, '').max(150),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(150),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        rg: Joi.string().allow(null, '').max(50),
        nacionalidade_id: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        expedicao_id: Joi.number().integer().allow(null, ''),
        profissao: Joi.string().allow(null, '').max(150),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        representanteLegal: Joi.number().integer().allow(null, ''),
        avalista: Joi.number().integer().allow(null, ''),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, avalistaController.create)

routes.put('/avalista/:avalista_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalista_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        outroDocumento: Joi.string().allow(null, '').max(150),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(150),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        rg: Joi.string().allow(null, '').max(50),
        nacionalidade_id: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        expedicao_id: Joi.number().integer().allow(null, ''),
        profissao: Joi.string().allow(null, '').max(150),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        representanteLegal: Joi.number().integer().allow(null, ''),
        avalista: Joi.number().integer().allow(null, ''),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, avalistaController.update)

routes.delete('/avalista/:avalista_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalista_id: Joi.number().integer().required()
    }),
}), verificaToken, avalistaController.destroy)


//AVALISTA_TOMADOR
//-------------------------------------------------------------------------------------------------------------
const avalistaTomadorController = require('./src/controllers/avalistaTomadorController')

routes.post('/avalista_tomadorConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), avalistaTomadorController.count)

routes.post('/avalista_tomadorListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), avalistaTomadorController.listaTodos)

routes.post('/avalista_tomadorListaUm/:avalistaTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalistaTomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, avalistaTomadorController.listaUm)

routes.post('/avalista_tomador', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        avalista_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().allow(null, ''),
        deletado: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, avalistaTomadorController.create)

routes.put('/avalista_tomador/:avalistaTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalistaTomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        avalista_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().allow(null, ''),
        deletado: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, avalistaTomadorController.update)

routes.delete('/avalista_tomador/:avalistaTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        avalistaTomador_id: Joi.number().integer().required()
    }),
}), verificaToken, avalistaTomadorController.destroy)


//BANCO
//-------------------------------------------------------------------------------------------------------------
const bancoController = require('./src/controllers/bancoController')

routes.post('/bancoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), bancoController.count)

routes.get('/bancoListaTodos', verificaToken, bancoController.listaTodos)

routes.post('/bancoListaUm/:banco_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        banco_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, bancoController.listaUm)

routes.post('/banco', celebrate({
    [Segments.BODY]: Joi.object().keys({
        numero: Joi.string().required().max(3),
        descricao: Joi.string().required().max(150),
        ispb: Joi.string().required().max(50),

    })
}), verificaToken, bancoController.create)

routes.put('/banco/:banco_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        banco_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        numero: Joi.string().required().max(3),
        descricao: Joi.string().required().max(150),
        ispb: Joi.string().required().max(50),

    })
}), verificaToken, bancoController.update)

routes.delete('/banco/:banco_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        banco_id: Joi.number().integer().required()
    }),
}), verificaToken, bancoController.destroy)



//CCG
//-------------------------------------------------------------------------------------------------------------
const ccgController = require('./src/controllers/ccgController')

routes.post('/ccgConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), ccgController.count)

routes.post('/ccgListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), ccgController.listaTodos)

routes.post('/ccgListaUm/:ccg_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ccg_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, ccgController.listaUm)

routes.post('/ccg', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().allow(null, '').max(50),
        arquivo: Joi.string().allow(null, '').max(250),
        ad_usr: Joi.number().integer().allow(null, ''),
        deletado: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, ccgController.create)

routes.put('/ccg/:ccg_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ccg_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().allow(null, '').max(50),
        arquivo: Joi.string().allow(null, '').max(250),
        ad_usr: Joi.number().integer().allow(null, ''),
        deletado: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, ccgController.update)

routes.delete('/ccg/:ccg_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ccg_id: Joi.number().integer().required()
    }),
}), verificaToken, ccgController.destroy)



//CLIENTE
//-------------------------------------------------------------------------------------------------------------
const clienteController = require('./src/controllers/clienteController')

routes.get('/clienteConta', verificaToken, clienteController.count)

routes.get('/clienteListaTodos', verificaToken, clienteController.listaTodos)

routes.get('/clienteListaUm/:cliente_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cliente_id: Joi.number().integer().required()
    })
}), verificaToken, clienteController.listaUm)

routes.post('/cliente', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cnpj: Joi.string().allow(null, '').length(14),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, clienteController.create)

routes.put('/cliente/:cliente_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cliente_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cnpj: Joi.string().allow(null, '').length(14),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, clienteController.update)

routes.delete('/cliente/:cliente_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cliente_id: Joi.number().integer().required()
    }),
}), verificaToken, clienteController.destroy)



//CLIENTE_USUARIO
//-------------------------------------------------------------------------------------------------------------

const clienteUsuarioController = require('./src/controllers/clienteUsuarioController');

routes.post('/clienteUsuarioConta', verificaToken, clienteUsuarioController.count);

routes.post('/clienteUsuarioListaUm/:clienteUsuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        clienteUsuario_id: Joi.number().integer().required()
    })
}), verificaToken, clienteUsuarioController.listaUm);

routes.post('/clienteUsuarioListaTodos', verificaToken, clienteUsuarioController.listaTodos);

routes.post('/clienteUsuario', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        usuario_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().optional().allow(null, ''),
        corretor_id: Joi.number().integer().optional().allow(null, ''),
        perfil_id: Joi.number().integer().optional().allow(null, ''),
        email: Joi.string().required().max(150),
        telefone: Joi.string().required().max(50),
        status: Joi.string().length(1).required(),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, clienteUsuarioController.create);

routes.put('/clienteUsuario/:clienteUsuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        clienteUsuario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        usuario_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().optional().allow(null, ''),
        corretor_id: Joi.number().integer().optional().allow(null, ''),
        perfil_id: Joi.number().integer().optional().allow(null, ''),
        email: Joi.string().required().max(150),
        telefone: Joi.string().required().max(50),
        status: Joi.string().length(1).required(),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, clienteUsuarioController.update);

routes.delete('/clienteUsuario/:clienteUsuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        clienteUsuario_id: Joi.number().integer().required()
    })
}), verificaToken, clienteUsuarioController.destroy);

routes.post('/consultaClienteUsuarioCpf/:cpf', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cpf: Joi.string().allow(null, '').length(11),
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required()
    }),
}), verificaToken, clienteUsuarioController.consultaClienteUsuarioCpf);



//COBERTURA
//-------------------------------------------------------------------------------------------------------------
const coberturaController = require('./src/controllers/coberturaController')

routes.post('/coberturaConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), coberturaController.count)

routes.post('/coberturaListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), coberturaController.listaTodos)

routes.post('/coberturaListaUm/:cobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cobertura_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, coberturaController.listaUm)

routes.post('/cobertura', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().max(50),
        descricao: Joi.string().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, coberturaController.create)

routes.put('/cobertura/:cobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cobertura_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().max(50),
        descricao: Joi.string().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, coberturaController.update)

routes.delete('/cobertura/:cobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cobertura_id: Joi.number().integer().required()
    }),
}), verificaToken, coberturaController.destroy)




//CORRETOR
//-------------------------------------------------------------------------------------------------------------
const corretorController = require('./src/controllers/corretorController')

routes.post('/corretorListaTomador', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
    })
}), corretorController.listaTomador)

routes.post('/corretorBusca', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().min(1).max(100)
    })
}), corretorController.busca)

routes.post('/corretorConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorController.count)

routes.post('/corretorListaTabela', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorController.listaTabela)

routes.post('/corretorListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorController.listaTodos)

routes.post('/corretorListaUm/:corretor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, corretorController.listaUm)

routes.post('/corretor', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().required(),
        nacionalidade_id: Joi.number().integer().allow(null),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        numeroConta: Joi.string().allow(null, '').max(50),
        tipoConta: Joi.string().allow(null, '').max(50),
        chavePix: Joi.string().allow(null, '').max(100),
        nomeCorrentista: Joi.string().allow(null, '').max(150),
        cpfCorrentista: Joi.string().allow(null, '').length(11),
        cnpjCorrentista: Joi.string().allow(null, '').length(14),
        pessoaContato: Joi.string().allow(null, '').max(150),
        emailPessoaContato: Joi.string().allow(null, '').max(150),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        comissaoPorcentagem: Joi.number().allow(null, ''),
        premioMinimo: Joi.number().allow(null, ''),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        susep: Joi.string().allow(null, '').max(50),
        ad_usr: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, corretorController.create)

routes.put('/corretor/:corretor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        nacionalidade_id: Joi.number().integer().allow(null, ''),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        numeroConta: Joi.string().allow(null, '').max(50),
        tipoConta: Joi.string().allow(null, '').max(50),
        chavePix: Joi.string().allow(null, '').max(100),
        nomeCorrentista: Joi.string().allow(null, '').max(150),
        cpfCorrentista: Joi.string().allow(null, '').length(11),
        cnpjCorrentista: Joi.string().allow(null, '').length(14),
        pessoaContato: Joi.string().allow(null, '').max(150),
        emailPessoaContato: Joi.string().allow(null, '').max(150),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        comissaoPorcentagem: Joi.number().allow(null, ''),
        premioMinimo: Joi.number().allow(null, ''),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        susep: Joi.string().allow(null, '').max(50),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().allow(null, ''),
    })
}), verificaToken, corretorController.update)

routes.delete('/corretor/:corretor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretor_id: Joi.number().integer().required()
    }),
}), verificaToken, corretorController.destroy)




//CORRETOR_FUNCIONARIO
//-------------------------------------------------------------------------------------------------------------
const corretorFuncionarioController = require('./src/controllers/corretorFuncionarioController')

routes.post('/corretor_funcionarioConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorFuncionarioController.count)

routes.post('/corretor_funcionarioListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorFuncionarioController.listaTodos)

routes.post('/corretor_funcionarioListaUm/:corretorFuncionario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorFuncionario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, corretorFuncionarioController.listaUm)

routes.post('/corretor_funcionario', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().required(),
        nome: Joi.string().required().max(150),
        cargo: Joi.string().allow(null, '').max(150),
        aniversario: Joi.string().allow(null, '').max(50),
        celular: Joi.string().allow(null, '').max(50),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(500),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, corretorFuncionarioController.create)

routes.put('/corretor_funcionario/:corretorFuncionario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorFuncionario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().required(),
        nome: Joi.string().required().max(150),
        cargo: Joi.string().allow(null, '').max(150),
        aniversario: Joi.string().allow(null, '').max(50),
        celular: Joi.string().allow(null, '').max(50),
        email: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(500),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, corretorFuncionarioController.update)

routes.delete('/corretor_funcionario/:corretorFuncionario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorFuncionario_id: Joi.number().integer().required()
    }),
}), verificaToken, corretorFuncionarioController.destroy)




//CORRETOR_PRODUTOR
//-------------------------------------------------------------------------------------------------------------
const corretorProdutorController = require('./src/controllers/corretorProdutorController')

routes.post('/corretorProdutorConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorProdutorController.count)

routes.post('/corretorProdutorListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), corretorProdutorController.listaTodos)

routes.post('/corretorProdutorListaUm/:corretorProdutor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorProdutor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, corretorProdutorController.listaUm)

routes.post('/corretorProdutor', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, corretorProdutorController.create)

routes.put('/corretorProdutor/:corretorProdutor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorProdutor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().required(),
        produtor_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, corretorProdutorController.update)

routes.delete('/corretorProdutor/:corretorProdutor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        corretorProdutor_id: Joi.number().integer().required()
    }),
}), verificaToken, corretorProdutorController.destroy)



//DOCUMENTO
//-------------------------------------------------------------------------------------------------------------
const documentoController = require('./src/controllers/documentoController')

routes.post('/documentoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), documentoController.count)

routes.post('/documentoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), documentoController.listaTodos)

routes.post('/documentoListaUm/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, documentoController.listaUm)

routes.post('/documento', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        favorecido_id: Joi.number().integer().allow(null, ''),
        tomador_id: Joi.number().integer().allow(null, ''),
        arquivo: Joi.string().required().max(500),
        uuid: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, documentoController.create)

routes.put('/documento/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        favorecido_id: Joi.number().integer().allow(null, ''),
        tomador_id: Joi.number().integer().allow(null, ''),
        arquivo: Joi.string().required().max(500),
        uuid: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, documentoController.update)

routes.delete('/documento/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
}), verificaToken, documentoController.destroy)





//EMISSAO
//-------------------------------------------------------------------------------------------------------------
const emissaoController = require('./src/controllers/emissaoController')

routes.post('/emissaoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoController.count)

routes.post('/emissaoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoController.listaTodos)

routes.post('/emissao', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        dataEmissao: Joi.date().required(),
        dataInicio: Joi.date().required(),
        dataVencimento: Joi.date().allow(null, ''),
        dias: Joi.number().integer().allow(null, ''),
        dataVencimentoIndeterminado: Joi.boolean().allow(null),
        moeda_id: Joi.number().integer().required(),
        valor: Joi.number().required(),        
        objeto: Joi.string().required(),
        modalidade_id: Joi.number().required(),
        modalidadeTexto: Joi.string().required(),
        taxa: Joi.number().allow(null),
        premio: Joi.number().allow(null),
        pago: Joi.boolean().allow(null),
        valorPago: Joi.number().allow(null),
        minuta: Joi.boolean().allow(null),
        garantia: Joi.boolean().allow(null),
        trabalhista: Joi.boolean().allow(null),
        fiscal: Joi.boolean().allow(null),
        textoTrabalhista: Joi.string().allow(null, ''),
        textoFiscal: Joi.string().allow(null, ''),
        ad_usr: Joi.number().integer().required()
    })
}), verificaToken, emissaoController.create);


routes.put('/emissao/:emissao_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissao_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        dataEmissao: Joi.date().required(),
        dataInicio: Joi.date().required(),
        dataVencimento: Joi.date().allow(null, ''),
        dias: Joi.number().integer().allow(null, ''),
        dataVencimentoIndeterminado: Joi.boolean().allow(null),
        moeda_id: Joi.number().integer().required(),
        valor: Joi.number().required(),        
        objeto: Joi.string().required(),
        modalidade_id: Joi.number().required(),
        modalidadeTexto: Joi.string().required(),
        taxa: Joi.number().allow(null),
        premio: Joi.number().allow(null),
        pago: Joi.boolean().allow(null),
        valorPago: Joi.number().allow(null),
        minuta: Joi.boolean().allow(null),
        garantia: Joi.boolean().allow(null),
        trabalhista: Joi.boolean().allow(null),
        fiscal: Joi.boolean().allow(null),
        textoTrabalhista: Joi.string().allow(null, ''),
        textoFiscal: Joi.string().allow(null, ''),
        sinistro: Joi.boolean().allow(null),
        bloqueada: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
                
    })
}), verificaToken, emissaoController.update)

routes.delete('/emissao/:emissao_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissao_id: Joi.number().integer().required()
    }),
}), verificaToken, emissaoController.destroy)



//EMISSAO_COBERTURA
//-------------------------------------------------------------------------------------------------------------
const emissaoCoberturaController = require('./src/controllers/emissaoCoberturaController')

routes.post('/emissao_coberturaConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoCoberturaController.count)

routes.post('/emissao_coberturaListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoCoberturaController.listaTodos)

routes.post('/emissao_coberturaListaUm/:emissaoCobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoCobertura_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, emissaoCoberturaController.listaUm)

routes.post('/emissao_cobertura', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        cobertura_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoCoberturaController.create)

routes.put('/emissao_cobertura/:emissaoCobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoCobertura_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        cobertura_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoCoberturaController.update)

routes.delete('/emissao_cobertura/:emissaoCobertura_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoCobertura_id: Joi.number().integer().required()
    }),
}), verificaToken, emissaoCoberturaController.destroy)




//EMISSAO_DOCUMENTO
//-------------------------------------------------------------------------------------------------------------
const emissaoDocumentoController = require('./src/controllers/emissaoDocumentoController')

routes.post('/emissao_documentoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoDocumentoController.count)

routes.post('/emissao_documentoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoDocumentoController.listaTodos)

routes.post('/emissao_documentoListaUm/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, emissaoDocumentoController.listaUm)

routes.post('/emissao_documento', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        arquivo: Joi.string().required().max(200),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoDocumentoController.create)

routes.put('/emissao_documento/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        arquivo: Joi.string().required().max(200),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoDocumentoController.update)

routes.delete('/emissao_documento/:documento_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        documento_id: Joi.number().integer().required()
    }),
}), verificaToken, emissaoDocumentoController.destroy)




//EMISSAO_FAVORECIDO
//-------------------------------------------------------------------------------------------------------------
const emissaoFavorecidoController = require('./src/controllers/emissaoFavorecidoController')

routes.post('/emissaoFavorecidoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoFavorecidoController.count)

routes.post('/emissaoFavorecidoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoFavorecidoController.listaTodos)

routes.post('/emissaoFavorecidoListaUm/:emissaoFavorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissao_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, emissaoFavorecidoController.listaUm)

routes.post('/emissaoFavorecido', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        favorecido_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoFavorecidoController.create)

routes.put('/emissaoFavorecido/:emissaoFavorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoFavorecido_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        favorecido_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoFavorecidoController.update)

routes.delete('/emissaoFavorecido/:emissaoFavorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoFavorecido_id: Joi.number().integer().required()
    }),
}), verificaToken, emissaoFavorecidoController.destroy)


//EMISSAO_TOMADOR
//-------------------------------------------------------------------------------------------------------------
const emissaoTomadorController = require('./src/controllers/emissaoTomadorController')

routes.post('/emissao_tomadorConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoTomadorController.count)

routes.post('/emissao_tomadorListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), emissaoTomadorController.listaTodos)

routes.post('/emissao_tomadorListaUm/:emissaoTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoTomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, emissaoTomadorController.listaUm)

routes.post('/emissao_tomador', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoTomadorController.create)

routes.put('/emissao_tomador/:emissaoTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoTomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, emissaoTomadorController.update)

routes.delete('/emissao_tomador/:emissaoTomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissaoTomador_id: Joi.number().integer().required()
    }),
}), verificaToken, emissaoTomadorController.destroy)



//EXPEDICAO
//-------------------------------------------------------------------------------------------------------------
const expedicaoController = require('./src/controllers/expedicaoController')

routes.post('/expedicaoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), expedicaoController.count)

routes.post('/expedicaoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), expedicaoController.listaTodos)

routes.post('/expedicaoListaUm/:expedicao_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        expedicao_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, expedicaoController.listaUm)

routes.post('/expedicao', celebrate({
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required().max(6),
    })
}), verificaToken, expedicaoController.create)

routes.put('/expedicao/:expedicao_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        expedicao_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required().max(6),
    })
}), verificaToken, expedicaoController.update)

routes.delete('/expedicao/:expedicao_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        expedicao_id: Joi.number().integer().required()
    }),
}), verificaToken, expedicaoController.destroy)




//FAVORECIDO
//-------------------------------------------------------------------------------------------------------------
const favorecidoController = require('./src/controllers/favorecidoController')

routes.post('/favorecidoBusca', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string(),
    })
}), favorecidoController.busca)

routes.post('/favorecidoListaTabela', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), favorecidoController.listaTabela)

routes.post('/favorecidoConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), favorecidoController.count)

routes.post('/favorecidoListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), favorecidoController.listaTodos)

routes.post('/favorecidoListaUm/:favorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        favorecido_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, favorecidoController.listaUm)

routes.post('/favorecido', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        nacionalidade_id: Joi.number().integer().allow(null),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(250),
        emailPessoaContato: Joi.string().allow(null, '').max(250),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        outroDocumento: Joi.string().allow(null, '').max(150),
        outroDocumentoDescricao: Joi.string().allow(null, '').max(150),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, favorecidoController.create)

routes.put('/favorecido/:favorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        favorecido_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        nacionalidade_id: Joi.number().integer().allow(null),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(250),
        emailPessoaContato: Joi.string().allow(null, '').max(250),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),        
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        outroDocumento: Joi.string().allow(null, '').max(150),
        outroDocumentoDescricao: Joi.string().allow(null, '').max(150),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, favorecidoController.update)

routes.delete('/favorecido/:favorecido_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        favorecido_id: Joi.number().integer().required()
    }),
}), verificaToken, favorecidoController.destroy)




//FINANCEIRO
//-------------------------------------------------------------------------------------------------------------
const financeiroController = require('./src/controllers/financeiroController')

routes.post('/financeiroConta', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), financeiroController.count)

routes.post('/financeiroListaTodos', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), financeiroController.listaTodos)

routes.post('/financeiroListaUm/:financeiro_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        financeiro_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, financeiroController.listaUm)

routes.post('/financeiro', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        formaPagamento_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().allow(null, ''),
        produtor_id: Joi.number().integer().allow(null, ''),
        pix_id: Joi.number().integer().allow(null, ''),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        conta: Joi.string().allow(null, '').max(50),
        cpf: Joi.string().allow(null, '').max(50),
        cnpj: Joi.string().allow(null, '').max(50),
        nome: Joi.string().allow(null, '').max(150),
        razaoSocial: Joi.string().allow(null, '').max(150),
        pixCnpj: Joi.string().allow(null, '').max(50),
        pixCpf: Joi.string().allow(null, '').max(50),
        pixCelular: Joi.string().allow(null, '').max(50),
        pixEmail: Joi.string().allow(null, '').max(50),
        pixAleatorio: Joi.string().allow(null, '').max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, financeiroController.create)

routes.put('/financeiro/:financeiro_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        financeiro_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        formaPagamento_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().allow(null, ''),
        produtor_id: Joi.number().integer().allow(null, ''),
        pix_id: Joi.number().integer().allow(null, ''),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        conta: Joi.string().allow(null, '').max(50),
        cpf: Joi.string().allow(null, '').max(50),
        cnpj: Joi.string().allow(null, '').max(50),
        nome: Joi.string().allow(null, '').max(150),
        razaoSocial: Joi.string().allow(null, '').max(150),
        pixCnpj: Joi.string().allow(null, '').max(50),
        pixCpf: Joi.string().allow(null, '').max(50),
        pixCelular: Joi.string().allow(null, '').max(50),
        pixEmail: Joi.string().allow(null, '').max(50),
        pixAleatorio: Joi.string().allow(null, '').max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, financeiroController.update)

routes.delete('/financeiro/:financeiro_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        financeiro_id: Joi.number().integer().required()
    }),
}), verificaToken, financeiroController.destroy)





//IBGE
//-------------------------------------------------------------------------------------------------------------
const ibgeController = require('./src/controllers/ibgeController')

routes.post('/ibgeConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, ibgeController.count)

routes.get('/listaUf', verificaToken, ibgeController.listaUf)

routes.get('/listaMunicipios/:uf_codigo', celebrate({
    [Segments.BODY]: Joi.object().keys({
        uf_codigo: Joi.string().required().max(2),
    })
}), verificaToken, ibgeController.listaMunicipios)

routes.post('/ibgeListaUm/:ibge_codigo', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ibge_codigo: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, ibgeController.listaUm)

routes.post('/ibge', celebrate({
    [Segments.BODY]: Joi.object().keys({
        ibge_descri: Joi.string().required().max(250),
        uf_codigo: Joi.string().required().max(2),
        uf_descri: Joi.string().required().max(150),
    })
}), verificaToken, ibgeController.create)

routes.put('/ibge/:ibge_codigo', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ibge_codigo: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        ibge_descri: Joi.string().required().max(250),
        uf_codigo: Joi.string().required().max(2),
        uf_descri: Joi.string().required().max(150),
    })
}), verificaToken, ibgeController.update)

routes.delete('/ibge/:ibge_codigo', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        ibge_codigo: Joi.number().integer().required()
    }),
}), verificaToken, ibgeController.destroy)



//LOGIN
//-------------------------------------------------------------------------------------------------------------
const loginController = require('./src/controllers/loginController')

routes.post('/login', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
        senha: Joi.string().required().max(32),
    })
}), verificaToken, loginController.login)



//MODALIDADE
//-------------------------------------------------------------------------------------------------------------
const modalidadeController = require('./src/controllers/modalidadeController')

routes.post('/modalidadeConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, modalidadeController.count)

routes.post('/modalidadeListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, modalidadeController.listaTodos)

routes.post('/modalidadeListaUm/:modalidade_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        modalidade_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, modalidadeController.listaUm)

routes.post('/modalidade', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().required().max(150),
        textoPre: Joi.string().required(),
        texto: Joi.string().required(),
        ad_usr: Joi.number().integer().required(),
        status: Joi.string().required().max(1),

    })
}), verificaToken, modalidadeController.create)

routes.put('/modalidade/:modalidade_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        modalidade_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().required().max(150),
        textoPre: Joi.string().required(),
        texto: Joi.string().required(),
        ad_usr: Joi.number().integer().required(),
        status: Joi.string().required().max(1),

    })
}), verificaToken, modalidadeController.update)

routes.delete('/modalidade/:modalidade_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        modalidade_id: Joi.number().integer().required()
    }),
}), verificaToken, modalidadeController.destroy)



//nacionalidade_id
//-------------------------------------------------------------------------------------------------------------
const nacionalidadeController = require('./src/controllers/nacionalidadeController')

routes.get('/nacionalidades', verificaToken, nacionalidadeController.index)



//NP
//-------------------------------------------------------------------------------------------------------------
const npController = require('./src/controllers/npController')

routes.post('/npConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, npController.count)

routes.post('/npListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, npController.listaTodos)

routes.post('/npListaUm/:np_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        np_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, npController.listaUm)

routes.post('/np', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        valor: Joi.number().required(),
        valorExtenso: Joi.string().required().max(200),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, npController.create)

routes.put('/np/:np_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        np_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        emissao_id: Joi.number().integer().required(),
        valor: Joi.number().required(),
        valorExtenso: Joi.string().required().max(200),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, npController.update)

routes.delete('/np/:np_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        np_id: Joi.number().integer().required()
    }),
}), verificaToken, npController.destroy)



//PDF
//-------------------------------------------------------------------------------------------------------------
const pdfController = require('./src/controllers/pdfController')

routes.post('/pdf/:emissao_id', verificaToken, celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        emissao_id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), pdfController.index)



//PERFIL
//-------------------------------------------------------------------------------------------------------------
const perfilController = require('./src/controllers/perfilController')

routes.post('/perfilConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, perfilController.count)

routes.get('/perfilListaTodos', verificaToken, perfilController.index)

routes.post('/perfilListaUm/:perfil_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        perfil_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, perfilController.listaUm)

routes.post('/perfil', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, perfilController.create)

routes.put('/perfil/:perfil_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        perfil_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, perfilController.update)

routes.delete('/perfil/:perfil_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        perfil_id: Joi.number().integer().required()
    }),
}), verificaToken, perfilController.destroy)





//PIX
//-------------------------------------------------------------------------------------------------------------
const pixController = require('./src/controllers/pixController')

routes.post('/pixConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, pixController.count)

routes.post('/pixListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, pixController.listaTodos)

routes.post('/pixListaUm/:pix_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        pix_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, pixController.listaUm)

routes.post('/pix', celebrate({
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required().max(50),
    })
}), verificaToken, pixController.create)

routes.put('/pix/:pix_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        pix_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required().max(50),
    })
}), verificaToken, pixController.update)

routes.delete('/pix/:pix_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        pix_id: Joi.number().integer().required()
    }),
}), verificaToken, pixController.destroy)




//PRODUTOR
//-------------------------------------------------------------------------------------------------------------
const produtorController = require('./src/controllers/produtorController')

routes.post('/produtorBusca', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().min(3).max(100)
    })
}), produtorController.busca)

routes.post('/produtorListaSelect', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.listaSelect)

routes.post('/produtorConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.count)

routes.post('/produtorListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.listaTodos)

routes.post('/produtorListaUm/:produtor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        produtor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.listaUm)

routes.post('/produtor', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        nacionalidade_id: Joi.number().allow(null),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        numeroConta: Joi.string().allow(null, '').max(50),
        tipoConta: Joi.string().allow(null, '').max(50),
        chavePix: Joi.string().allow(null, '').max(100),
        nomeCorrentista: Joi.string().allow(null, '').max(150),
        cpfCorrentista: Joi.string().allow(null, '').length(11),
        cnpjCorrentista: Joi.string().allow(null, '').length(14),
        pessoaContato: Joi.string().allow(null, '').max(150),
        emailPessoaContato: Joi.string().allow(null, '').max(150),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        comissaoPorcentagem: Joi.number().allow(null, ''),
        premioMinimo: Joi.number().allow(null, ''),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        susep: Joi.string().allow(null, '').max(50),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.create)

routes.put('/produtor/:produtor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        produtor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        nacionalidade_id: Joi.number().allow(null),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        banco_id: Joi.number().integer().allow(null, ''),
        agencia: Joi.string().allow(null, '').max(50),
        numeroConta: Joi.string().allow(null, '').max(50),
        tipoConta: Joi.string().allow(null, '').max(50),
        chavePix: Joi.string().allow(null, '').max(100),
        nomeCorrentista: Joi.string().allow(null, '').max(150),
        cpfCorrentista: Joi.string().allow(null, '').length(11),
        cnpjCorrentista: Joi.string().allow(null, '').length(14),
        pessoaContato: Joi.string().allow(null, '').max(150),
        emailPessoaContato: Joi.string().allow(null, '').max(150),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        comissaoPorcentagem: Joi.number().allow(null, ''),
        premioMinimo: Joi.number().allow(null, ''),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        susep: Joi.string().allow(null, '').max(50),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, produtorController.update)

routes.delete('/produtor/:produtor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        produtor_id: Joi.number().integer().required()
    }),
}), verificaToken, produtorController.destroy)


//TOMADOR
//-------------------------------------------------------------------------------------------------------------
const tomadorController = require('./src/controllers/tomadorController')

routes.post('/buscaTomador', verificaToken, celebrate({

    [Segments.BODY]: Joi.object().keys({

        tomador: Joi.string().required(),
        cliente_id: Joi.number().integer().required(),

    }),

}), tomadorController.find)

routes.post('/tomadorVerificaDuplicidade', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        documento: Joi.string().required().length(14),
    })
}), tomadorController.verificaDuplicidade)

routes.post('/tomadorBusca', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        descricao: Joi.string().min(3).max(100)
    })
}), tomadorController.busca)

routes.post('/tomadorListaTabela', verificaToken, celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), tomadorController.listaTabela)

routes.post('/tomadorConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorController.count)

routes.post('/tomadorListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorController.listaTodos)

routes.post('/tomadorListaUm/:tomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        tomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorController.listaUm)

routes.post('/tomador', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        nacionalidade_id: Joi.number().integer().allow(null),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(250),
        emailPessoaContato: Joi.string().allow(null, '').max(250),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        limiteGeral: Joi.number().allow(null),
        limiteTomado: Joi.number().allow(null),
        limiteTradicional: Joi.number().allow(null),
        taxaTradicional: Joi.number().allow(null),
        limiteRecursal: Joi.number().allow(null),
        taxaRecursal: Joi.number().allow(null),
        limiteFinanceira: Joi.number().allow(null),
        taxaFinanceira: Joi.number().allow(null),
        limiteJudicial: Joi.number().allow(null),
        taxaJudicial: Joi.number().allow(null),
        limiteEstruturada: Joi.number().allow(null),
        taxaEstruturada: Joi.number().allow(null),
        restricao: Joi.boolean().allow(null),
        aprovado: Joi.boolean().allow(null),
        bloqueado: Joi.boolean().allow(null),
        outroDocumento: Joi.string().allow(null, '').max(150),
        outroDocumentoDescricao: Joi.string().allow(null, '').max(150),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, tomadorController.create)

routes.put('/tomador/:tomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        tomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tipoJuridico: Joi.string().required().length(1),
        cpf: Joi.string().allow(null, '').length(11),
        cnpj: Joi.string().allow(null, '').length(14),
        nome: Joi.string().allow(null, '').max(250),
        nomeFantasia: Joi.string().allow(null, '').max(250),
        razaoSocial: Joi.string().allow(null, '').max(250),
        cep: Joi.string().allow(null, '').max(50),
        ibge_codigo: Joi.string().allow(null, '').max(7),
        ibge_descri: Joi.string().allow(null, '').max(250),
        uf: Joi.string().allow(null, '').max(2),
        logradouro: Joi.string().allow(null, '').max(500),
        numero: Joi.string().allow(null, '').max(150),
        complemento: Joi.string().allow(null, '').max(100),
        bairro: Joi.string().allow(null, '').max(150),
        estadoCivil: Joi.string().allow(null, '').max(50),
        profissao: Joi.string().allow(null, '').max(150),
        nacionalidade_id: Joi.number().integer().allow(null),
        telefoneFixo: Joi.string().allow(null, '').max(100),
        telefoneCelular: Joi.string().allow(null, '').max(100),
        email: Joi.string().allow(null, '').max(100),
        pessoaContato: Joi.string().allow(null, '').max(250),
        emailPessoaContato: Joi.string().allow(null, '').max(250),
        telefoneFixoPessoaContato: Joi.string().allow(null, '').max(100),
        telefoneCelularPessoaContato: Joi.string().allow(null, '').max(100),
        observacao: Joi.string().allow(null, '').max(1000),
        cnae: Joi.string().allow(null, '').max(50),
        cnaeDescricao: Joi.string().allow(null, '').max(250),
        capitalSocial: Joi.number().allow(null, ''),
        naturezaJuridica: Joi.string().allow(null, '').max(250),
        situacao: Joi.string().allow(null, '').max(150),
        dataAbertura: Joi.date().allow(null, ''),
        dataUltimaAtualizacao: Joi.date().allow(null, ''),
        tipoEmpresa: Joi.string().allow(null, '').max(50),
        porte: Joi.string().allow(null, '').max(250),
        dataSituacao: Joi.date().allow(null, ''),
        motivoSituacao: Joi.string().allow(null, '').max(250),
        situacaoEspecial: Joi.string().allow(null, '').max(250),
        dataSituacaoEspecial: Joi.date().allow(null, ''),
        limiteGeral: Joi.number().allow(null),
        limiteTomado: Joi.number().allow(null),
        limiteTradicional: Joi.number().allow(null),
        taxaTradicional: Joi.number().allow(null),
        limiteRecursal: Joi.number().allow(null),
        taxaRecursal: Joi.number().allow(null),
        limiteFinanceira: Joi.number().allow(null),
        taxaFinanceira: Joi.number().allow(null),
        limiteJudicial: Joi.number().allow(null),
        taxaJudicial: Joi.number().allow(null),
        limiteEstruturada: Joi.number().allow(null),
        taxaEstruturada: Joi.number().allow(null),
        restricao: Joi.boolean().allow(null),
        aprovado: Joi.boolean().allow(null),
        bloqueado: Joi.boolean().allow(null),
        outroDocumento: Joi.string().allow(null, '').max(150),
        outroDocumentoDescricao: Joi.string().allow(null, '').max(150),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, tomadorController.update)

routes.delete('/tomador/:tomador_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        tomador_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required()
    })
}), verificaToken, tomadorController.destroy)




//TOMADOR_CORRETOR
//-------------------------------------------------------------------------------------------------------------
const tomadorCorretorController = require('./src/controllers/tomadorCorretorController')

routes.post('/tomadorCorretorConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorCorretorController.count)

routes.post('/tomadorCorretorListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorCorretorController.listaTodos)

routes.post('/tomadorCorretorListaUm/:tomadorCorretor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        tomadorCorretor_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, tomadorCorretorController.listaUm)

routes.post('/tomadorCorretor', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        tomador_id: Joi.number().integer().required(),
        corretor_id: Joi.number().integer().required(),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, tomadorCorretorController.create)

routes.delete('/tomadorCorretor/:tomadorCorretor_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        tomadorCorretor_id: Joi.number().integer().required()
    }),
}), verificaToken, tomadorCorretorController.destroy)



//USUARIO
//-------------------------------------------------------------------------------------------------------------
const usuarioController = require('./src/controllers/usuarioController')

routes.post('/usuarioConta', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.count)

routes.get('/consultaUsuarioCpf/:cpf', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
    })
}), verificaToken, usuarioController.consultaUsuarioCpf)

routes.post('/usuarioListaTabela', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.listaTabela)

routes.post('/usuarioListaTodos', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.listaTodos)

routes.post('/usuario/:usuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        usuario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.show)

routes.post('/usuarioListaCpf/:cpf', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.listaCpf)

routes.post('/usuario', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        perfil_id: Joi.number().integer().required(),
        cpf: Joi.string().required().length(11),
        nome: Joi.string().required().max(150),
        senha: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.create)

routes.put('/usuario/:usuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        usuario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        perfil_id: Joi.number().integer().required(),
        nome: Joi.string().required().max(150),
        bloqueado: Joi.boolean().allow(null),
        ad_usr: Joi.number().integer().required(),

    })
}), verificaToken, usuarioController.update)

routes.post('/usuarioAlteraSenha/:usuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        usuario_id: Joi.number().integer().required()
    }),
    [Segments.BODY]: Joi.object().keys({
        cliente_id: Joi.number().integer().required(),
        senha: Joi.string().required().max(50),
        ad_usr: Joi.number().integer().required(),
    })
}), verificaToken, usuarioController.alteraSenha)

routes.delete('/usuario/:usuario_id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        usuario_id: Joi.number().integer().required()
    }),
}), verificaToken, usuarioController.destroy)


module.exports = routes