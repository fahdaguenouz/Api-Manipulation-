const jwt = require('jsonwebtoken');



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