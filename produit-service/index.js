const express = require("express");
 const app = express();
 const PORT = process.env.PORT_ONE || 4000;
 const mongoose = require("mongoose");
 const Produit = require("./Produit");
 app.use(express.json());
 mongoose.set('strictQuery', true);


 const connect = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/produit-service');
    console.log("connected to db");
}


app.post("/produit/ajouter", (req, res, next) => {
    const { nom, description, prix } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });
    newProduit.save()
        .then(produit => res.status(201).json(produit))
        .catch(error => res.status(400).json({ error }));
});


app.post("/produit/acheter", (req, res, next) => {
    const { ids } = req.body;
    Produit.find({ _id: { $in: ids } })
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json({ error }));

});

app.listen(PORT, async () => {
    await connect()
    console.log(`Product-Service at ${PORT}`);
});