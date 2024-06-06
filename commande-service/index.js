const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
app.use(express.json());
mongoose.set('strictQuery', true);
const axios = require('axios');

const connect = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/commande-service');
    console.log("connected to db");
}



function prixTotal(produits) {
    let total = 0;
    for (let t = 0; t < produits.length; ++t) {
        total += produits[t].prix;
    }
    return total;
}



async function httpRequest(ids) {
    try {
        const URL = "http://localhost:4000/produit/acheter"
        const response = await axios.post(URL, { ids: ids }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return prixTotal(response.data);
    } catch (error) {
        console.error(error);
    }
}




app.post("/commande/ajouter", async (req, res, next) => {


    const { ids, email_utilisateur } = req.body;
    httpRequest(req.body.ids).then(total => {
        const newCommande = new Commande({
            ids,
            email_utilisateur: email_utilisateur,
            prix_total: total,
        });
        newCommande.save()
            .then(commande => res.status(201).json(commande))
            .catch(error => res.status(400).json({ error }));
    });
});




app.listen(PORT, async () => {
    await connect()
    console.log(`Product-Service at ${PORT}`);
});