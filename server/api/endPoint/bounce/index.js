'use strict';

var express = require('express');
var controller = require('./bounceEndpoint');

var router = express.Router();


router.get('/:token', controller.show);
router.post('/new', controller.create);
router.put('/defer', controller.defer);

module.exports = router;