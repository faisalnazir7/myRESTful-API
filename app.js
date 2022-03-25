const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
  });

const Article = mongoose.model("Article", articleSchema);

//////////////////req. targetting a specific article//////
// chaining method, chainned to common route
app.route("/articles").get(function(err, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
    
  });
}).post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
      if(!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
  });
}).delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  })
});

//////////////////req. targetting a specific article///////
app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
    if(foundArticles) {
      res.send(foundArticles);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  );
})

.patch(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.")
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the corresponding article.");
      }
    }
  );
});



app.listen(3000, function(){
    console.log("Server active on port 3000")
});
