'use strict';

var express = require('express');
var controller = require('./bounceEndpoint');

var router = express.Router();

router.get('/', controller.show);
router.get('/:token', controller.show);
router.post('/new', controller.create);

module.exports = router;