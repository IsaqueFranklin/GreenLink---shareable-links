const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Link = new Schema({
    title: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    button: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    whats: {
        type: String
    }
})

mongoose.model('links', Link)