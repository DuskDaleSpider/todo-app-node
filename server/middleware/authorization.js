const jwt = require('jsonwebtoken');

//Verifies the JWT in the Authorization header
//If everything checks out, it assigns a user to the request
const AuthorizeUser = (req, res, next) => {
    const header = req.headers['authorization'];
    console.log(header);
    console.log(req.headers);
    if(typeof header == 'undefined'){
        const error = new Error("Unauthorized");
        res.status(403);
        return next(error);
    }
    
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            res.stats(403);
            const error = new Error("Unauthorized");
            return next(error);
        }
        req.user = user;
        next();
    });
};

module.exports = AuthorizeUser;
