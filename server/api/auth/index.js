const express = require('express');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../../db/connection.js');
const users = db.get('users');
users.createIndex("username", {unique: true});

const router = express.Router();

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

router.get('/', (req, res, next) => {
    res.json({
        message: "You've reached the auth!"
    });
});

router.post('/signup', (req, res, next) => {
    var body = req.body;

    //validate 
    var valResult = schema.validate(body);
    if(valResult.error){
        return next(valResult.error);
    }
    //successful validation
    //
    //
    //check if username already exists
    body = valResult.value;
    users.findOne({username: body.username}).then(result => {
        if(result != null){
            const error = new Error('User already exists!'); 
            return next(error);
        }
    });

    //hash password and insert new user in db
    bcrypt.hash(body.password, 10, (err, hash) =>{
        users.insert({
            username: body.username,
            password: hash
        }).then(result => {
            res.json({username: result.username});
        }).catch(err => { return next(err); });
    });

});

router.post('/signin', (req, res, next) => {
    var body = req.body;

    var valResult = schema.validate(body);
    if(valResult.error){
        return next(valResult.error);
    }
    //successful validation
    //retrieve user from database and compare bcrypt hash
    body = valResult.value;
    users.findOne({username: body.username}).then(user => {
        if(user == null){
            const username_err = new Error("Username/Password is incorrect");
            return next(username_err);
        }
        bcrypt.compare(body.password, user.password, (err, result) => {
            if(err){
                const err = new Error("Username/Password is incorrect");
                return next(err);
            }
            if(result){
                //successful log in!
                const token_payload = {
                    _id: user._id,
                    username: user.username
                };
                jwt.sign(token_payload, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
                    if(err){
                        console.log(err);
                        const error = new Error("Something went wrong.");
                        return next(error);
                    }
                    res.set('Authorization', `Bearer ${token}`);
                    res.json({message: 'Log in Successful!'});
                });
            }else{
                const err = new Error("Username/Password is incorrect");
                next(err);
            }
        });
    }); 
});

module.exports = router;
