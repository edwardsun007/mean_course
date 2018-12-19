// var mongoose = require('mongoose');
// var path = require("path");
// var User = mongoose.model("User");
// var Food = mongoose.model("Food");
// var Order = mongoose.model("Order");
// const nodemailer = require('nodemailer');
// module.exports = {
//     create: function (req, res) {
//         var new_food = new Food({
//             food_name: req.body.food_name,
//             price: req.body.price,
//             description: req.body.description,
//             image: req.body.image
//         })
//         new_food.save(function (err) {
//             if (err) {

//             } else {
//                 res.json("good");
//             }
//         })
//     },

//     get_foods: function (req, res) {
//         Food.find({}, function (err, foods) {
//             if (err) {
//                 console.log("err")
//             } else {
//                 res.json(foods);
//             }
//         })
//     },

//     place_order: function (req, res) {
//         var user_id = req.params.user_id;
//         var food = req.body;
//         console.log(req.body.length);
//         User.findOne({
//             _id: user_id
//         }, function (err, user) {
//             if (err) {
//                 console.log("err from place order: ", err);
//             } else {
//                 var order = new Order();
//                 order.total_price = 0;
//                 order.order_user = user._id;
//                 order.quantity = "";
//                 for (var i = 0; i < food.length; i++) {
//                     order.foods.push(food[i]);
//                     order.total_price += (food[i].price * food[i].quantity);
//                     order.quantity += (food[i].food_name + ": " + food[i].quantity + "; ")
//                 }

//                 order.save(function (err) {
//                     if (err) {
//                         console.log("err from save order: ", err);
//                     } else {
//                         res.json("success submit order");
//                         var transporter = nodemailer.createTransport({
//                             service: 'gmail',
//                             auth: {
//                                 user: 'foodreadyoh@gmail.com',
//                                 pass: 'codingdojo2018'
//                             }
//                         });

//                         var content = `
//                             <h2>Here is the order summary: </h2>
//                             <p>Ordered by: ${user.first_name} ${user.last_name}</p>
//                             <p>Total Price: ${order.total_price}</p>
//                             <p>Quantity: ${order.quantity}</p>
//                             <p>Order date: ${order.createdAt}</p>

//                         `
//                         var mailList = [
//                             user.email,
//                             "foodreadyoh@gmail.com"
//                         ]

//                         var mailOptions = {
//                             from: 'foodreadyoh@gmail.com',
//                             to: mailList,
//                             subject: 'Order Summary from FoodWeb Service',
//                             html: content
//                         };
//                         transporter.sendMail(mailOptions, function (error, info) {
//                             if (error) {
//                                 console.log(error);
//                             } else {
//                                 console.log('Email sent: ' + info.response);
//                             }
//                         });
//                     }
//                 })
//             }
//         })

//     },

//     retrieveOrder: function (req, res) {
//         var user_id = req.params.id;
//         Order.find({
//             order_user: user_id
//         }).sort({
//             createdAt: "desc"
//         }).populate("foods").exec(function (err, order) {
//             if (err) {
//                 console.log("err from retrieve order: ", err);
//             } else {
//                 res.json(order);
//                 // console.log("retrieve all orders: ", order);
//             }
//         })
//     },

//     delete_food: function(req, res) {
//         Food.remove({_id: req.params.id}, function(err) {
//             if(err) {
//                 console.log("err from delete food: ", err);
//             }
//             else {
//                 res.json("delete food success")
//             }
//         })
//     },

//     retrieveAllOrder: function(req, res) {
//         Order.find({}).populate("order_user").populate("foods").exec(function(err, orders) {
//             if(err) {
//                 console.log("err from retrieve all orders: ", err);
//             }
//             else {
//                 res.json(orders);
//             }
//         })
//     },

//     like: function (req, res) {
//         var userId = req.params.user_id;
//         var foodId = req.params.food_id;
//         Food.findOne({
//             _id: foodId
//         }).populate("likeBy").exec(function (err, food) {
//             if (err) {
//                 res.json({
//                     err: err
//                 });
//             } else {
//                 let check = false;
//                 for (let index = 0; index < food.likeBy.length; index++) {
//                     if (food.likeBy[index]._id == userId) {
//                         check = true;
//                     }
//                 }
//                 if (check) {
//                     let index = food.likeBy.indexOf(userId);
//                     console.log("checking", userId);
//                     food.likeBy.splice(index, 1);
//                     food.save(function (err) {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             res.json("like good");
//                         }
//                     })


//                 } else {
//                     food.likeBy.push(userId);
//                     console.log("checking", typeof (userId));
//                     console.log(food.likeBy[0]);
//                     food.save(function (err) {
//                         if (err) {
//                             console.log(err);
//                         } else {
//                             res.json("like good user");
//                         }
//                     })

//                 }
//             }
//         })
//     },

// }
