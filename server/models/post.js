const mongoose = require('mongoose');

// Schema Is ONly bluePrint
var postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true }
}, {timestamps: true});

module.exports =  mongoose.model("Post", postSchema); // turn blueprint into model


