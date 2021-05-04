//Configurando Módulos

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/usuario')
const Usuario = mongoose.model('usuarios')
require('../models/link')
const link = mongoose.model('links')

//Rotas


router.get('/perfil', function(req, res){
    Usuario.findOne(req.user).lean().populate('links').then(function(usuarios){
        link.find({autor: req.user.nome}).sort({_id: -1}).lean().then(function(links){
            res.render('userviews/perfil', {usuarios: usuarios, links: links})
        }).catch(function(err){
            req.flash('error_msg', 'Erro ao listar.')
            res.redirect('/user/perfil')
        })
    })
})

router.get('/operfil/:autor', function(req, res){
    Usuario.findOne({nome: req.params.autor}).lean().populate('links').then(function(usuarios){
        link.find({autor: req.params.autor}).sort({_id: -1}).lean().then(function(links){
            res.render('userviews/operfil', {usuarios: usuarios, links: links})
        }).catch(function(err){
            req.flash('error_msg', 'Erro ao listar.')
            res.redirect('/user/perfil')
        })
    })
})


router.get('/editar', function(req, res){
    Usuario.findOne(req.user).lean().then(function(usuarios){
        res.render('userviews/editarperfil', {usuarios: usuarios})
    })
})

router.post('/editarperfil', function(req, res){
    Usuario.findOne({_id: req.body.id}).then(function(usuarios){

        usuarios.nome = req.body.nome;
        usuarios.email = req.body.email;
        usuarios.bio = req.body.bio;
        usuarios.perfil = req.body.perfil;

        usuarios.save().then(function(){
            req.flash("success_msg", "Perfil editado com sucesso.");
            res.redirect('/user/perfil')
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao salvar.")
            res.redirect('/user/perfil')
        })

    })
})


router.get('/criarlink', function(req, res){
    res.render('userviews/criarlink')
})

router.post('/criarlink', function(req, res){
    var erros = []

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Link está sem conteúdo."})
    }

    if(!req.body.button || typeof req.body.button == undefined || req.body.button == null){
        erros.push({texto: "Botão de pagamento está vazio."})
    }

    if(erros.length > 0){
        res.render('userviews/criarlinks', {erros: erros})
    }else{
        const novoLink = {
            conteudo: req.body.conteudo,
            autor: req.user.nome,
            title: req.body.title,
            button: req.body.button,
            image: req.body.image,
            whats: req.body.whats
        }

        new link(novoLink).save().then(function(){
            req.flash('success_msg', 'Link criado com sucesso.')
            res.redirect('/user/perfil')
        }).catch(function(err){
            req.flash('error_msg', 'Houve um erro ao criar link.')
            res.redirect('/user/criarlink')
        })
    }
})


router.post('/editar/link', function(req, res){
    link.findOne({_id: req.body.id}).then(function(links){

        links.title = req.body.title;
        links.conteudo = req.body.conteudo;
        links.image = req.body.image;
        links.button = req.body.button;
        links.whats = req.body.whats;

        links.save().then(function(){
            req.flash("success_msg", "Perfil editado com sucesso.");
            res.redirect('/user/perfil')
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao salvar.")
            res.redirect('/user/perfil')
        })

    })
})


router.get('/link/:id', function(req, res){
    link.findOne({_id: req.params.id}).lean().then(function(links){
        res.render('userviews/link', {links: links})
    })
})


router.get('/editarlink/:id', function(req, res){
  link.findOne({_id: req.params.id}).lean().then(function(links){
    res.render('userviews/editarlink', {links: links})
  }).catch(function(err){
    req.flash('error_msg', 'Algo deu errado.')
    res.redirect('/user/editarlink/:id')
  })
})

router.post("/editarlink", function (req, res) {
    link.findOne({ _id: req.body.id })
      .then(function (posts) {
        links.title = req.body.title;
        links.conteudo = req.body.conteudo;
        links.image = req.body.image;
        links.button = req.body.button;
        links.whats = req.body.whats;

        links.save().lean().then(function () {
            req.flash("success_msg", "Link editado com sucesso.");
            res.redirect("/user/perfil");
          })
          .catch(function (err) {
            req.flash("error_msg", "Erro interno.");
            res.redirect("/user/perfil");
          });
      })
      .catch(function (err) {
        req.flash("error_msg", "Houve um erro ao salvar a edição.");
        res.redirect("/user/perfil");
      });
  });

router.get('/excluir/:id', function(req, res){
  link.remove({_id: req.params.id}).lean().then(function(){
    req.flash('success_msg','Deletador com sucesso.')
    res.redirect('/user/perfil')
  }).catch(function(err){
    req.flash('error_msg','Houve um erro.')
    res.redirect('/user/perfil')
  })
})

//Exportando

module.exports = router;
