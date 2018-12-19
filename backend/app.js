// const express = require('express');

// const app =  express();

app.use(express.static( __dirname + '/dist/pm' ));
console.log(__dirname + '../dist/pm');

/* RESTful */
app.use('/api/posts', (req,res,next) => {
  const posts = [
    {
      id: "1",
      title: "First post",
      content: "This is coming from the server"
    },
    {
      id: "2",
      title: "Second server-side post",
      content: "This is 2nd posts content"
    }
  ];

  res.json({
    message: "Success",
    post: posts});
});

module.exports = app;  // export this file as module
