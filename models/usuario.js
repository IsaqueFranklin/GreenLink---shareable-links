const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    perfil: {
        type: String
    }
})

mongoose.model('usuarios', Usuario)