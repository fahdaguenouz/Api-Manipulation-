const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Utilisateur = require("./Utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
app.use(express.json());

const connect = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/auth-service');
    console.log("connected to db");
}





app.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const user = new Utilisateur({ email, password });
        bcrypt.hash(password, 10, async (err, hash) => {
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





app.post('/auth/login', async (req, res) => {
 
    const { email, password } = req.body;
 
    const user = await Utilisateur.findOne({ email });
 
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






app.listen(PORT, async () => {
    await connect()
    console.log(`Product-Service at ${PORT}`);
});