const mongoose = require('mongoose')

const EquipeSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country: String
})

const Equipe = mongoose.model('Equipes', EquipeSchema)

module.exports = Equipe