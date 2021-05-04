const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/usuario')
const Usuario = mongoose.model('usuarios')
require('../models/link')
const link = mongoose.model('links')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', function(req, res){
  res.render('startviews/registro')
})

// Registro e validação de requisitos para Registro

router.post('/registro', function(req, res){
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido"})
  }

  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "Email inválido"})
  }

  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
    erros.push({texto: "Senha inválida"})
  }

  if(req.body.senha.length < 8){
    erros.push({texto: "Senha muito curta"})
  }

  if(req.body.senha != req.body.senha2){
    erros.push({texto: "As senhas são diferentes, tente novamente"})
  }

  if(erros.length > 0){

    res.render('start/registro', {erros: erros})

  }else{

    Usuario.findOne({email: req.body.email}).then(function(usuario){
      if(usuario){
        req.flash("error_msg", "Já existe uma conta com esse email")
        res.redirect('/start/registro')
      }else{

        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
            if(erro){
              req.flash('error_msg', 'Houve um erro durante o salvamento do usuário.')
              res.redirect('/start/registro')
            }

            novoUsuario.senha = hash

            novoUsuario.save().then(function(){
              req.flash('success_msg', "Usuário criado com sucesso!")
              res.redirect('/start/login')
            }).catch(function(err){
              req.flash('error_msg', 'Houve um erro ao criar usuário, tente novamente.')
              res.redirect('/start/registro')
            })

          })
        })

      }
    }).catch(function(err){
      req.flash("error_msg", "Houve um erro interno")
      res.redirect('/')
    })

  }
})

router.get('/login', function(req, res){
  res.render('startviews/login')
})

router.post('/login', function(req, res, next){

  passport.authenticate('local', {
    successRedirect: '/user/perfil',
    failureRedirect: '/start/login',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', function(req, res){

  req.logout()
  req.flash('success_msg', 'Deslogado com sucesso')
  res.redirect('/')

})

module.exports = router
