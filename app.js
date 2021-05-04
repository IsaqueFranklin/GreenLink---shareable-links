//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const session  = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const start = require('./routes/start')
const user = require('./routes/user')
const passport = require('passport')
require('./config/auth')(passport)

//Configuração

app.use(session({
    secret: 'Charutex',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.user = req.user || null;
    next()
})

//BodyParser

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Handlebars

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//Mongoose

mongoose.Promise = global.Promise
mongoose.connect("").then(function(){
    console.log('Conectado ao mongo.')
  }).catch(function(err){
    console.log('Erro ao se conectar com o mongo: '+err)
  })


//Public

app.use(express.static(path.join(__dirname, 'public')))

//Rotas

app.use('/start', start)
app.use('/user', user)


app.get('/', function(req, res){
    res.render('index')
})


//Iniciando servidor

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})