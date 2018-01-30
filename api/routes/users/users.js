const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../../models/user');

// GET users get all users
router.get('/', (req, res, next) => {
    User.find().exec()
        .then(result => { 
            res.status(200).json(result);
        })
        .then(res => 
            console.log(res)
        )
        .catch(error => res.status(500).json({
            message: error.message
        }));
});

// POST create user
router.post('/', (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age
    })

    user.save().then(result => {
        res.status(200).json({
            result: result
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    });
});

// GET users/:userId get by id
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;

    User.findById(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result) 
            } else {
                res.status(404).json({
                    message: "Object not found!"
                })
            }

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
});

// PATCH users/:userId update by id 
router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({_id: id}, { $set: updateOps}).exec()
        .then(result => {
            res.status(200).json(result) 
        })
        .catch(error => res.status(500).json({
            error: error
        }));
});

// DELETE users/:userId get by id
router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json(result) 
        })
        .catch(error => next(error));
});

module.exports = router;
