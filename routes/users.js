var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Stretch Goal 
router.get("/", function (req, res, next) {
  res.render("users", { title: "Users" });
});

router.get('/myname', function(req, res, next) {
  res.send('Leah');
});

router.get('/myfavoritemovies', function(req, res, next) {
  res.json(["Dirty Dancing", "Tenet", "Selena"]);
});


module.exports = router;
