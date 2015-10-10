'use strict';

var express = require('express');
var controller = require('./bounce.controller');

var router = express.Router();

router.get('/:token', controller.show);

module.exports = router;