const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');




router.get('/', (req, res) => {
    res.render('login');
})



module.exports = router;