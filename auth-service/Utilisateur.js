const mongoose = require("mongoose");
const UtilisateurSchema = mongoose.Schema({
   
    email: String,
    password: String,
});
module.exports = Utilisateur = mongoose.model("utilisateur", UtilisateurSchema);