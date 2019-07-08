
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Email already exist"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created"
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
};

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'Auth failed'
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(404).json({
                            message: 'Auth failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1h'
                            })
                        return res.status(400).json({
                            message: "Login Successfully",
                            token: token
                        })
                    } else {
                        return res.status(404).json({
                            message: 'Auth failed'
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
};


exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id }).exec().then(result => res.status(200).json({
        message: "User deleted",
        request: {
            type: 'POST',
            url: 'http:localhost:3000/user/signup'
        }
    }))
        .catch(err => res.status(500).json({ error: err }));
}