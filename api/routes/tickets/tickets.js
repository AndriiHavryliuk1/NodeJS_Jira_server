const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ticket = require('../../models/ticket');


router.post("/", (req, res, next) => {
    const ticket = new Ticket({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    ticket.save()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({ 
            error: error
    }));
});

module.exports = router;

