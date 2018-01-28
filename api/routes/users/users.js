const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handle get request to users!"
    })
});

router.post('/', (req, res, next) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };
    res.status(200).json({
        message: "Handle post request to users !",
        createdUser: user
    })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: "Got special ID!",
            id: id
        })
    } else {
        res.status(200).json({
            message: "Got your ID!",
            id: id
        })
    }

});

module.exports = router;
