var mainroutes = require('../controllers/mainControl.js');
var foods = require('../controllers/foods.js');
var path = require('path');


module.exports = function(app){ 
  //register
  app.post("/register", function(req, res) {
    mainroutes.register(req, res);
  })
  
  //login
  app.post("/login", function(req, res) {
    mainroutes.login(req, res);
  })

  app.post('/foods', function(req, res){
    foods.create(req, res);
  })

  app.get('/foods', function(req, res){
    foods.get_foods(req, res);
  })

  app.post("/checkuser", function(req, res) {
    mainroutes.check_user(req, res);
  })

  app.post("/social_update", function(req, res) {
    mainroutes.social_update(req, res);
  })

  app.post("/orders/:user_id", function(req, res) {
    foods.place_order(req, res);
  })

  app.get("/orders/:id", function(req,res) {
    foods.retrieveOrder(req, res);
  })

  app.delete("/deletefood/:id", function(req, res) {
    foods.delete_food(req, res);
  })

  app.get("/all_order", function(req, res) {
    foods.retrieveAllOrder(req, res);
  })

  app.post("/like/:user_id/:food_id", function (req, res) {
    foods.like(req, res);
  })

  app.all("*",function(req,res){
    res.sendFile('index.html', { root: './client/dist' });
  })
}
