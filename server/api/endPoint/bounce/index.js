'use strict';

var express = require('express');
var controller = require('./bounceEndpoint');

var router = express.Router();

router.get('/:token', controller.show);
router.post('/', controller.create);

module.exports = router;