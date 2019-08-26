//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongoose connection step

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});


//heroku step setup the port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// create schema for article
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);
//////////////////// Resquest Targeting all article////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }

    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully Delete all the articles");
      } else {
        res.send(err);
      }
    });
  });
//////////////////// Resquest Targeting specified article////////////////////
  app.route("/articles/:whichArticle")
    .get(function(req, res){
      Article.findOne({title:req.params.whichArticle}, function(err, foundArticle){
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No Artile was founded");
        }
      });
    })
    .put(function(req, res){
      Article.update(
        {title: req.params.whichArticle},
        {title : req.body.title, content: req.body.content}, {overwrite: true},
        function(err){
          if(!err){
            res.send("successfully update the article");
          }
        }
      );
    })
    .patch(function(req, res){
      Article.update(
        {title: req.params.whichArticle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("successfully update partial the article");
          }
        }
      );
    })
    .delete(function(req, res){
      Article.deleteOne({title: req.params.whichArticle}, function(err) {
        if (!err) {
          res.send("successfully Delete specified the articles");
        } else {
          res.send(err);
        }
      });
    });




app.listen(3000, function() {
  console.log("server is started successfully");
});
