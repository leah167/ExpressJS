var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/datetime', function(req, res, next) {
//   res.send(new Date());
// });

// router.get('/postblog', function (req, res, next){
//   res.render('postBlog');
// })

module.exports = router;
