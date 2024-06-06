
const express = require('express');

const app = express();
const connect = require("./db");
const Produits = require("./models/Produits")
const bcrypt = require('bcrypt');
const UserModel = require("./models/User")
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const jwt = require('jsonwebtoken');

app.get('/', function (req, res) {



    res.send('Hello World')
});


const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
 
    if (!token) {
        return res.status(401).send('Token not found');
    }
 
    jwt.verify(token, 'TEST', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
 
        req.user = decoded.user;
        next();
    });
};


app.get('/produits', async (req, res) => {
    let produit = await Produits.find()
    res.send(produit);

});



app.post('/produits' ,isAuthenticated, async (req, res) => {
    const produit = new Produits(req.body);
    await produit.save();
    res.status(201).send(produit);
});



app.get('/produits/:code', async (req, res) => {
    const code = parseInt(req.params.code);
    const produit = await Produits.findOne({ code });
    res.status(200).send(produit);
});



app.put('/produits/:code', async (req, res) => {
    const code = parseInt(req.params.code);
    const newEquipe = req.body;
    const result = await Produits.replaceOne({ code }, newEquipe);
    res.send(result);
})





app.delete('/produits/:code', async (req, res) => {
    const code = parseInt(req.params.code);
    const result = await Produits.deleteOne({ code });
    res.send(result);
})




// app.post('/user/register', async (req, res) => {
//     const user = new UserModel({
//         email: req.body.email,
//         password: req.body.password
//     });
//     bcrypt.hash(req.body.password, 10, function (err, hash) {
//         user.password = hash;
//         user.save()
//     })
//     res.status(201).send(user);
// });


app.post('/user/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = new UserModel({ email, password });
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                console.error('Error hashing password', err);
                return res.status(500).send({ error: 'Error hashing password' });
            }
            user.password = hash;

            await user.save();
            res.status(201).send(user);

        });
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).send({ error: 'Error registering user' });
    }
});






app.post('/user/login', async (req, res) => {
 
    const { email, password } = req.body;
 
    const user = await UserModel.findOne({ email });
 
    if (!user) {
        return res.send('L\'utilisateur existe pas');
    }
 
    bcrypt.compare(password, user.password, (err, valide) => {
 
        if (valide) {
            const token = jwt.sign(
                { user },
                'TEST',
                { expiresIn: '1h' }
            );
 
            res.cookie('token', token, { httpOnly: true });
            return res.send(token);
 
        } else {
            return res.send('le mot de passe est incorrect');
        }
 
    });
 
})



app.listen(3001, async () => {
    await connect()
    console.log('server is up in PORT 3001');
})
