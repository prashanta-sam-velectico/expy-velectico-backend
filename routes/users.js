var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/ram', function(req, res, next) {
  res.send('here is ram');
});




module.exports = router;