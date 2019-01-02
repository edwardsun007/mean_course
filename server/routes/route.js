const express = require("express");
const multer = require("multer");
const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { // called when multer tries to save file
                //request, file, callback
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {  // if its known extention set error to null
        error = null;
      }
      cb(error, "server/images"); // this path is relative to server.js not route.js
  },
  filename: (req,file,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');//replace whitespace with dash
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now()+ '.' + ext)
  }
});



/* RESTful API */
// Add an new post
// add multer middleware, single means we only expect 1 single file
router.post("", multer({storage: storage}).single("image"), (req, res)=>{
  // const post = req.body; // old way was get it via HTTP request
  console.log('req.get(host)=',req.get("host"));
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({ // initiate instance of our model with javascript object
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename // post request create imagePath that has url /images/ in it
    //image:req.body.image
  });
  post.save().then(
    createdPost => {
      res.status(201).json({
        message: "Post added",
        post: {
          ...createdPost,
          id:createdPost._id
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
        }
      });
    }
  );
});

// update a post by id
router.put("/:id", (req,res)=>{
  console.log('update api called:', req.params.id);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then( result=> {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

// find and update a post by id
// router.put("/api/posts/:id", (req, res)=> {
//   console.log('router.put req.body.title=',req.body.title);
//   console.log('router put req.body.content=',req.body.content)
//   Post.findOne(
//       {_id:req.params.id},
//       (err,post)=>{
//           if(err){
//               console.log('Post Not found!');
//               res.json({message:"Error",error:err});
//           }else{
//               console.log('Found post:',post);
//               post.title=req.body.title;
//               post.content=req.body.content;
//               post.save((err,p)=>{
//                   if(err){
//                       console.log('Save from update failed!');
//                       res.json({message:"Error",error:err});
//                   }else{
//                       res.json({message:"update success",data:p});
//                   }
//               })
//           }
//       }
//   );
// });
   // get all posts
router.get("", (req,res) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Post fetched successfully!",
      data: documents
      });
  });
});


// get single post based on id
router.get("/:id", (req,res) => {
  console.log('API->FindOne->called:',req.params.id);
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post); // if post not empty / undefined return it
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

// delete a post by id
router.delete("/:id", (req,res) => {
  console.log('API->deleteOne->called:', req.params.id);
  Post.findOneAndDelete({_id:req.params.id}, (err, post)=>{
    if(err){
      res.json('delete failed! ',err);
    }else{
      res.status(200).json({ message: "Post deleted!"});
    }
  });
});

module.exports = router;
