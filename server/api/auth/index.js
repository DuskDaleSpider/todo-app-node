const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');

const db = require('../../db/connection.js');
const users = db.get('users');
users.createIndex("username", {unique: true});

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        message: "You've reached the auth!"
    });
});

router.post('/signup', (req, res, next) => {
    var body = req.body;
    //validate 
    const schema = joi.object({
        username: joi.string()
            .trim()
            .pattern(/^\w+$/)
            .min(4)
            .max(20)
            .required(),
        password: joi.string()
            .trim()
            .min(7)
            .max(255)
            .required()
    });
    
    var valResult = schema.validate(body);
    if(valResult.error){
        next(valResult.error);
    }else{
        //successful validation
        //
        //
        //check if username already exists
        body = valResult.value;
        users.findOne({username: body.username}).then(result => {
            if(result != null){
                const error = new Error('User already exists!'); 
                next(error);
            }
        });

        //hash password and insert new user in db
        bcrypt.hash(body.password, 10, (err, hash) =>{
            users.insert({
                username: body.username,
                password: hash
            }).then(result => {
                res.json({username: result.username});
            }).catch(err => { next(err); });
        });
    }
    
});

module.exports = router;
