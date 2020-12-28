const express = require('express');
const bodyParser = require("body-parser");
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://klahari:srilayak@cluster0.z6fgu.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(()=>{
      console.log('Connected to database');
  })
  .catch(()=>{
    console.log('Connection failed');
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-with,Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
});

app.post("/api/posts",(req,res,next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
 post.save().then(createdPost =>{
  res.status(201).json({
    message:"post added sucessfully",
    postId: createdPost._id
  });
 });

});

app.get("/api/posts",(req,res,next)=>{
  Post.find().then(documents =>{
    res.status(200).json({
      message: "posts success",
      posts: documents
   });
  });
});

app.delete("/api/posts/:id",(req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(reult =>{
    console.log(result);
    res.status(200).json({message: "post deleted!"});
  });

});

app.put("/api/posts/:id",(req,res,next)=>{
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id},post).then(result =>{
    console.log(result);
    res.status(200).json({
      message:"update success"
    });
  });

})

app.get("/api/posts/:id",(req,res,next)=>{
  Post.findById(req.params.id).then(post =>{
    if(post){
       res.status(200).json(post);
    }else{
      res.status(404).json({message:'post not found'});
    }
  })
});



module.exports = app;
