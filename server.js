const http = require('http');
const debug = require('debug')('node-angular');
const express = require('express');
const bodyparser = require('body-parser');
var mongoose = require('mongoose');

/* import our models */
const Post = require('./server/models/post');

const app =  express();
/* connect to MongoDB atlas */
mongoose.connect("mongodb+srv://dev007:DOZbYKwOgSzdjXq3@cluster0-93fyy.mongodb.net/udemy-posts?retryWrites=true")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// To fix CORS Error
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*"); // no matter which domain is sending request, it will be allowed to access our resource
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS"); // define which HTTP verbs are allowed to sent request
  next();  // include this to let express scan the next middleware
});

//const app = require('./backend/app');
app.use(express.static( __dirname + '/dist/mean-course' ));
console.log(__dirname + '/dist/mean-course');

/* RESTful API */
// Add new post
app.post("/api/posts", (req, res)=>{
  // const post = req.body; // old way was get it via HTTP request
  const post = new Post({ // initiate instance of our model with javascript object
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(
    createdPost => {
      res.status(201).json({
        message: "Post added",
        postId: createdPost._id
      });
    }
  );
  // res.status(201).json(
  //   {message:"Post added", post: post});
});

// update a post by id
app.put("/api/posts/:id", (req,res)=>{
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
// app.put("/api/posts/:id", (req, res)=> {
//   console.log('app.put req.body.title=',req.body.title);
//   console.log('app put req.body.content=',req.body.content)
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

// get single post based on id
app.get("/api/posts/:id", (req,res)=>{
  console.log('API->FindOne->called:',req.params.id);
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post); // if post not empty / undefined return it
    }else{
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

// delete a post by id
app.delete("/api/posts/:id", (req,res)=>{
  console.log('API->deleteOne->called:', req.params.id);
  Post.findOneAndDelete({_id:req.params.id}, (err, post)=>{
    if(err){
      res.json('delete failed! ',err);
    }else{
      res.status(200).jsonjson({ message: "Post deleted!"});
    }
  });
});

// app.get('app/posts/:id', (req,res)=>{
//     Post.findById({_id:req.params.id}, (err,post)=>{
//       if(err){
//         res.json('find by id failed!',err);
//       }else{
//         res.json({message:"Post fetched successfully!",data: post});
//       }
//     });
// });

app.get('/api/posts', (req,res) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Post fetched successfully!",
      data: documents
      });
  });
  // Dojo Way
  // Post.find({}, (err,posts)=>{
  //    if(err){
  //      console.log('Got error from getting posts',err);
  //      res.json({message: 'Error', error:err});
  //    } else {
  //      res.json({message:'Success', data:posts});
  //    }
  // })

  // res.status(200).json({
  //   message: "Success",
  //   posts: posts});
  // dummy backend data for now, later will pull from MongoDB
  // const posts = [
  //   {
  //     id: "1",
  //     title: "First post",
  //     content: "This is coming from the server"
  //   },
  //   {
  //     id: "2",
  //     title: "Second server-side post",
  //     content: "This is 2nd posts content"
  //   }
  // ];
});



/* little trick for error proof on port number */
const normalizePort = val =>{
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >=0 ){
    return port;
  }

  return false;
};

const onError = error => {
  if(error.syscall !== "listen"){
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe" + addr : "port " + port;

  switch (error.code){
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;

    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);

app.set('port',port);

const server = http.createServer(app);
server.on("error", onError); // catch event error, callback onError
server.on("listening", onListening); // catch event listening, callback onListening
server.listen(port,()=>{
  console.log(`server.js running on ${port}`);
});

//require('./server/config/mongoose.js') // add our Mongoose configuration to server.js
