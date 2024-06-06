const mongoose = require('mongoose')

const shemaProduit = new mongoose.Schema({
    id: Number,
    code:Number,
    nom: String,
    prix: String,
    quantite:String,
})

const Produits = mongoose.model('Produits', shemaProduit)

module.exports = Produits